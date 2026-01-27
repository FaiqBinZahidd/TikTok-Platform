import pandas as pd
import os

files = [
    r"c:\Users\Faiq\OneDrive\Desktop\TikTok-Platform\17 dec - 19 dec 25.xlsx",
    r"c:\Users\Faiq\OneDrive\Desktop\TikTok-Platform\product_list.xlsx",
    r"c:\Users\Faiq\OneDrive\Desktop\TikTok-Platform\Business Advisor - Product - Performance .xls"
]

for f in files:
    print(f"\n--- Analyzing: {os.path.basename(f)} ---")
    if not os.path.exists(f):
        print("File not found.")
        continue
    
    try:
        if f.endswith('.xls'):
            # Try reading as HTML first (common for some platforms) or regular xls
            try:
                df = pd.read_excel(f, engine='xlrd')
            except:
                try:
                    df = pd.read_html(f)[0]
                except:
                    print(f"Could not read {f} as XLS or HTML.")
                    continue
        else:
            df = pd.read_excel(f)
            
        print("Columns found:")
        print(list(df.columns))
        
        # Look for customer related keywords
        keywords = ['name', 'buyer', 'customer', 'recipient', 'ship', 'city', 'email', 'address']
        matches = [c for c in df.columns if any(k in str(c).lower() for k in keywords)]
        print("Potential Customer Fields:", matches)
        
    except Exception as e:
        print(f"Error analyzing {f}: {e}")
