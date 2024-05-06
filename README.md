# Online Learning Platform

## Notes

### Still need to create the main features but these are some notes/todos

- Look into swapping to database sessions instead of JWT

- Apply rate limiting

  - Possible solution: <https://github.com/vercel/next.js/tree/canary/examples/api-routes-rate-limit>

- Refactor error handling

  - Possible solution:
    - data-access functions return the object or null
    - use-case functions return the object or `throw new Error("Error message")`
    - server actions use a try catch to return the thrown error `return {error: error.message}`
    - after server action is done, check data.error or data.success and set states

- Add tests

- and a lot more...
