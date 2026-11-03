fetch('http://localhost:5005/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "TestUser",
    email: "test" + Date.now() + "@college.edu",
    password: "password123",
    role: "STUDENT"
  })
})
.then(r => r.json().then(data => ({status: r.status, data})))
.then(console.log)
.catch(console.error);
