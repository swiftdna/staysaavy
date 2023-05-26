from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize the browser
driver = webdriver.Chrome()
driver.maximize_window()

# Navigate to the hotel reservation website
driver.get("http://3.137.202.7:4000")

# Fill in the form
city_input = driver.find_element(By.ID, "city")
state_input = driver.find_element(By.ID, "state")
country_select = Select(driver.find_element(By.ID, "country"))
from_date_input = driver.find_element(By.ID, "from-date")
to_date_input = driver.find_element(By.ID, "to-date")

city_input.send_keys("New York")
state_input.send_keys("New York")
country_select.select_by_visible_text("United States")
from_date_input.send_keys("2023-06-01")
to_date_input.send_keys("2023-06-05")

# Submit the form
submit_button = driver.find_element(By.ID, "submit")
submit_button.click()

# Wait for the hotel list to load
hotel_list = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "hotel-list"))
)

# Choose a hotel and reserve it
hotels = hotel_list.find_elements(By.CLASS_NAME, "hotel")
first_hotel = hotels[0]
reserve_button = first_hotel.find_element(By.CLASS_NAME, "reserve-button")
reserve_button.click()

# Close the browser
driver.quit()
