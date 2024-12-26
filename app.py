import os
from kaching_sdk import FoundryClient
from foundry_sdk_runtime.auth import UserTokenAuth
from flask import Flask, render_template, jsonify
import pandas as pd
from kaching_sdk.ontology.objects import Transaction

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
    # Store all transactions in a list first
    transaction_list = list(TransactionObject.iterate())

    data = []
    for transaction in transaction_list:
        data.append({
            'date': transaction.date_,
            'amount': float(transaction.amount),
            'description': transaction.description,
            'transaction_number': transaction.transaction_number
        })

    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')

    # print(transaction_list)

    # print(transaction_list)

    # Get categories for transactions
    try:
        print("Creating transaction set...")
        categories = client.ontology.queries.transaction_categorization(
            transactions=TransactionObject
        )
        print(f"Categories received successfully.")

        # Add categories to dataframe
        df['category'] = 'Uncategorized'  # Default value

        # Parse the JSON string into a dictionary if it's a string
        if isinstance(categories, str):
            import json
            categories = json.loads(categories)

        if isinstance(categories, dict):
            # Create a mapping of transaction numbers to their categories
            transaction_to_category = {}
            category_totals = {}

            for category, data in categories.items():
                category_totals[category] = data['total']
                for transaction in data['transactions']:
                    transaction_to_category[transaction['transaction_number']] = category

            # Add categories to dataframe by mapping transaction numbers
            df['category'] = df.apply(
                lambda row: transaction_to_category.get(
                    row['transaction_number'], 'Uncategorized'),
                axis=1
            )

            # Update category summary to use the new totals
            category_summary = category_totals
        else:
            print(f"Unexpected categories format: {type(categories)}")

    except Exception as e:
        print(f"Error getting categories: {e}")
        print(f"Error type: {type(e)}")
        print(f"Error details: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        df['category'] = 'Uncategorized'

    # Separate credits and debits
    credits_df = df[df['amount'] < 0]
    debits_df = df[df['amount'] >= 0]

    # Get category summaries for debits (spending)
    category_summary = debits_df.groupby(
        'category')['amount'].sum().apply(float).to_dict()

    return jsonify({
        'total_transactions': int(len(df)),
        'total_credits': float(credits_df['amount'].sum()),
        'total_debits': float(debits_df['amount'].sum()),
        'daily_dates': [d.strftime('%Y-%m-%d') for d in df['date'].unique()],
        'daily_credits': [int(credits_df[credits_df['date'] == d].shape[0]) for d in df['date'].unique()],
        'daily_debits': [int(debits_df[debits_df['date'] == d].shape[0]) for d in df['date'].unique()],
        'credit_amounts': [float(x) for x in credits_df['amount'].tolist()],
        'debit_amounts': [float(x) for x in debits_df['amount'].tolist()],
        'amounts': [float(x) for x in df['amount'].tolist()],
        'dates': df['date'].dt.strftime('%Y-%m-%d').tolist(),
        'descriptions': df['description'].tolist(),
        'categories': df['category'].tolist(),
        'category_summary': category_summary
    })

if __name__ == '__main__':
    app.run(debug=True)