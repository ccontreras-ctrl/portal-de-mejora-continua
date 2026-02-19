
import sys
import os

try:
    # Add the venv site-packages to path so we can test imports
    venv_path = r"C:\Users\Usuario\Documents\antigravity_tools\notebooklm-mcp-antigravity\venv\Lib\site-packages"
    sys.path.append(venv_path)
    
    import notebooklm_mcp
    print("notebooklm_mcp imported successfully")
    
    from notebooklm_mcp.server import mcp
    print("mcp object loaded")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
