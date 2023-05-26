from selenium import webdriver
from selenium.webdriver.common.by import By

# Initialize the browser
driver = webdriver.Chrome()
driver.maximize_window()

# Navigate to the registration page
driver.get("http://3.137.202.7:4000/register")

# Fill in the registration form
username_input = driver.find_element(By.ID, "username")
email_input = driver.find_element(By.ID, "email")
password_input = driver.find_element(By.ID, "password")
confirm_password_input = driver.find_element(By.ID, "confirm-password")

username_input.send_keys("test")
email_input.send_keys("test@gmail.com")
password_input.send_keys("123456")
confirm_password_input.send_keys("123456")

# Submit the registration form
submit_button = driver.find_element(By.ID, "submit")
submit_button.click()

# Verify registration success
success_message = driver.find_element(By.ID, "success-message")
assert success_message.text == "Registration successful!"

# Close the browser
driver.quit()
