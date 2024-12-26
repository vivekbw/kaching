import os
from kaching_sdk import FoundryClient
from foundry_sdk_runtime.auth import UserTokenAuth
from flask import Flask, render_template, jsonify
import pandas as pd

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

@app.route('/')
def dashboard():
    return render_template('dashboard.html')


@app.route('/api/transactions')
def get_transactions():
    TransactionObject = client.ontology.objects.Transaction
    transactions = TransactionObject.iterate()

    data = []
    for transaction in transactions:
        data.append({
            'date': transaction.date_,
            'amount': float(transaction.amount),
            'description': transaction.description
        })

    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')

    # Separate credits and debits
    credits_df = df[df['amount'] < 0]
    debits_df = df[df['amount'] >= 0]

    # Calculate daily counts for credits and debits
    daily_credits = credits_df.groupby('date').size()
    daily_debits = debits_df.groupby('date').size()
    all_dates = df['date'].unique()

    return jsonify({
        'total_transactions': int(len(df)),
        'total_credits': float(credits_df['amount'].sum()),
        'total_debits': float(debits_df['amount'].sum()),
        'daily_dates': [d.strftime('%Y-%m-%d') for d in all_dates],
        'daily_credits': [int(daily_credits.get(d, 0)) for d in all_dates],
        'daily_debits': [int(daily_debits.get(d, 0)) for d in all_dates],
        'credit_amounts': [float(x) for x in credits_df['amount'].tolist()],
        'debit_amounts': [float(x) for x in debits_df['amount'].tolist()],
        'amounts': [float(x) for x in df['amount'].tolist()],
        'dates': df['date'].dt.strftime('%Y-%m-%d').tolist(),
        'descriptions': df['description'].tolist()
    })

if __name__ == '__main__':
    app.run(debug=True)