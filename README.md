# Project-3

Project Proposal: College Football Recruiting Visualization
Team Members:
-	Edgar A. Guevara
-	Jesicca Barker
-	Kanwal Iftikhar
-	Lakshmi Sameera K
-	Pankaj Sethi
-	Stephen Whitson

Introduction:
Our project aims to visualize college football recruiting data to provide insights into the origins and characteristics of recruits, as well as help players identify areas for improvement to increase their chances of getting into their desired schools. We will leverage data from the College Football Data API and create a Python Flask-powered API, HTML/CSS, and JavaScript-based web application to showcase the visualizations.

1. Dataset Selection:
We will utilize the recruiting players dataset available at https://collegefootballdata.com/exporter/recruiting/players. This dataset contains detailed information about college football recruits, including their attributes, commitments, positions, schools, and more. The dataset consists of over 100 records, providing sufficient data to generate meaningful visualizations.

2. Visualizations and Interactions:
Our web application will offer the following visualizations and user-driven interactions:

a) Filter Options:
   - Position: Users can filter the recruits based on their playing positions.
   - Year: Users can select a specific year to explore the recruiting data.
   - Committed to: Users can filter recruits based on the schools they have committed to.

b) Data Visualization:
   - Charting Height, Weight, and Rating: We will create interactive charts to showcase the distribution and trends of recruits' height, weight, and rating.
   - Map Visualization: We will plot the location of recruits' schools on a map, using city and state information, providing a geographical perspective on recruiting hotspots.
   - Number Dashboard: A dashboard will display the total number of players based on the selected filters, giving users an overview of the dataset.

c) User-driven Interaction:
   - Menus and Dropdowns: Users will be able to select filter options through dropdown menus.
   - Textboxes: Users can input specific values or search queries in textboxes to further refine the data.

3. Technology Stack:
We will employ the following technologies and libraries to develop our visualization project:

- Python Flask: To create a backend API that interacts with the database and handles user requests.
- SQL Database: We will pull and clean the dataset using python/pandas, storing it in an SQL database for efficient data retrieval.
- HTML/CSS: To design and structure the web application's frontend user interface.
- JavaScript: To implement interactive elements and handle data visualizations on the client side.
- Leaflet: A JavaScript library for creating interactive maps to display the location of recruits' schools.
- Chart.js: A JavaScript library for creating responsive and interactive charts.
- Other libraries: We will explore additional JavaScript libraries as needed to enhance the project's functionality and aesthetics.

4. Project Timeline:
To ensure the timely completion of our project, we have outlined the following timeline:

- By 6/21/23 (start of class):
  - Pull and clean the dataset, storing it in an SQL database using Python.
  - Develop the Flask-powered API to define the parameters for data retrieval.

- By 6/26/23 (end of class):
  - Implement JavaScript-based visualizations using the API's data.
  - Design and incorporate HTML/CSS elements for user interface and interaction.

- By 6/28/23:
  - Perform thorough testing and debugging of the application.
  - Make necessary refinements and enhancements to ensure a smooth user experience.

Conclusion:
Our project will provide an interactive and insightful visualization of college football recruiting data, enabling users to explore recruit characteristics, identify areas for improvement, and gain a better understanding of where recruits are coming from. By leveraging various technologies and libraries, we aim to create an engaging web application that fulfills the requirements outlined in the project description.
