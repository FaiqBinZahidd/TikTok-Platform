import pandas as pd
import sys

excel_path = r"c:\Users\Faiq\OneDrive\Desktop\TikTok-Platform\17 dec - 19 dec 25.xlsx"

try:
    # Read the first few rows to get headers
    df = pd.read_excel(excel_path, nrows=5)
    print("Columns found:")
    for col in df.columns:
        print(f"- {col}")
    
    print("\nSample Data (Row 0):")
    print(df.iloc[0].to_dict())
except Exception as e:
    print(f"Error reading file: {e}")
