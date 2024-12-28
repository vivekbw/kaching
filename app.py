import os
from kaching_sdk import FoundryClient
from kaching_sdk.core.api import UserTokenAuth
from flask import Flask, render_template, jsonify
import pandas as pd
from kaching_sdk.ontology.objects import Transaction

print(f"Using kaching_sdk version: {kaching_version}")

app = Flask(__name__)

# Foundry setup
auth = UserTokenAuth(
    hostname="https://vivek.usw-18.palantirfoundry.com",
    token=os.environ["FOUNDRY_TOKEN"]
)

client = FoundryClient(
    auth=auth, 
    hostname="https://vivek.usw-18.palantirfoundry.com"
)

print(auth)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/transactions')
def get_transactions():
    TransactionObject = client.ontology.objects.Transaction
    transaction_list = list(TransactionObject.iterate())

    print("\n=== Transaction Object Properties ===")
    print(dir(TransactionObject))

    print("ACTIONS: ", client.ontology.actions.create_transaction)

    print("\n=== Individual Transaction Properties ===")
    for transaction in transaction_list[:10]:
        print("\nTransaction:", transaction)
        print("Available attributes:", dir(transaction))
        print("Date:", transaction.date_)
        print("Amount:", transaction.amount)
        print("Description:", transaction.description)
        print("Transaction Number:", transaction.transaction_number)
        print("Category:", getattr(transaction,
              'category', 'No category attribute'))
        print("All properties:", transaction.__dict__)
        print("-" * 50)

    data = []
    for transaction in transaction_list:
        print(transaction)
        data.append({
            'date': transaction.date_,
            'amount': float(transaction.amount),
            'description': transaction.description,
            'transaction_number': transaction.transaction_number,
            # Safely get category
            'category': getattr(transaction, 'category', None)
        })

    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')

    # Separate deposits and withdrawals
    deposits_df = df[df['amount'] < 0]
    withdrawals_df = df[df['amount'] >= 0]

    # Get category summaries for withdrawals (spending)
    category_summary = withdrawals_df.groupby(
        'category')['amount'].sum().apply(float).to_dict()

    return jsonify({
        'total_transactions': int(len(df)),
        'total_deposits': float(deposits_df['amount'].sum()),
        'total_withdrawals': float(withdrawals_df['amount'].sum()),
        'daily_dates': [d.strftime('%Y-%m-%d') for d in df['date'].unique()],
        'daily_deposits': [int(deposits_df[deposits_df['date'] == d].shape[0]) for d in df['date'].unique()],
        'daily_withdrawals': [int(withdrawals_df[withdrawals_df['date'] == d].shape[0]) for d in df['date'].unique()],
        'deposit_amounts': [float(x) for x in deposits_df['amount'].tolist()],
        'withdrawal_amounts': [float(x) for x in withdrawals_df['amount'].tolist()],
        'amounts': [float(x) for x in df['amount'].tolist()],
        'dates': df['date'].dt.strftime('%Y-%m-%d').tolist(),
        'descriptions': df['description'].tolist(),
        'categories': df['category'].tolist(),
        'category_summary': category_summary
    })

if __name__ == '__main__':
    app.run(debug=True)