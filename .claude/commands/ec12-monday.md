Help me look up and configure Monday.com column IDs for the EC12 project.

Steps:
1. Open and display the current column config: `ec12-app/config/monday-columns.js`
2. Show me which board IDs and column IDs are still blank (empty strings)
3. Remind me how to find my column IDs:
   - Go to monday.com/graphql (the API Explorer)
   - Run the query in `ec12-app/config/get-columns.graphql`
   - Replace BOARD_ID with the number from your board's URL
4. Ask me which board I want to configure first
5. When I paste in the column data, help me map it to the right fields in monday-columns.js and update the file

Explain what each column type means (status, text, date, people, connect_boards) as we go.
