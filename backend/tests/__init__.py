# Test configuration file
import os

# Test directory
TEST_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(TEST_DIR)

# Add root directory to path for imports
import sys
sys.path.insert(0, ROOT_DIR)
