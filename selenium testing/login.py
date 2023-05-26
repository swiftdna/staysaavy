# http://3.137.202.7:4000

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize the browser
driver = webdriver.Chrome()
driver.maximize_window()

# Navigate to the login page
driver.get("http://3.137.202.7:4000/login")

# Fill in the login form
username_input = driver.find_element(By.ID, "username")
password_input = driver.find_element(By.ID, "password")

username_input.send_keys("test@gmail.com")
password_input.send_keys("123456")

# Submit the login form
submit_button = driver.find_element(By.ID, "submit")
submit_button.click()

# Wait for the user dashboard to load
user_dashboard = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "user-dashboard"))
)

# Perform some action on the user dashboard
# ...

# Close the browser
driver.quit()
