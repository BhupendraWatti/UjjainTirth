👉 WordPress becomes your API
👉 React Native becomes your frontend app
		
        5
Flow:
    App loads-> React Native calls your WordPress API-> WordPress sends JSON-> You store it in state-> UI renders from state

Architecture View. 

WordPress Admin Panel
        ↓
WordPress Database
        ↓
WordPress REST API
        ↓
React Native App (fetches JSON)
        ↓
Mobile UI updates


*********************************************************
Headless CMS Architecture 