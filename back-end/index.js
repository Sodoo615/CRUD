const express = require('express');
const port = 8080;
const app = express()
const cors = require('cors')
const fs = require('fs')
app.use(cors())
app.use(express.json());
const array = [
    {
        name: "Bold",
        age: 16,
        height: "190cm",
    },
    {
        name: "Bat",
        age: 17,
        height: "180cm",
    },
    {
        name: "Dorj",
        age: 18,
        height: "188cm"
    }
]

// app.get('/users', function (req, res) {
//     res.json({ users: array })
// })
// app.get('/users/:name', function (req, res) {
//     const { name } = req.params
//     const user = array.filter((user) => user.name == name)[0];
//     res.json(user)
// })
// app.post('/users', function (req, res) {
//     const { name, age } = req.body;
//     array.push({ name, age })
//     res.json({ users: array })
// })
// app.put('/', function (req, res) {
//     res.send('Hi express Server  Backend')
// })
// app.patch('/', function (req, res) {
//     res.json({ message: 'Hello  express Server  Backend' })
//     res.push('Hello hhh express Server  ')
// })
// app.delete('/', function (req, res) {
//     res.send('Hello express Server  Backend')
// })
// app.listen(port, () => {
//     console.log("Server is running on http://localhost:" + port);
// });
// app.post("/user", (req, res) => {
//     const data = req.body
//     console.log(names)
//     res.json({
//         status: 'success'
//     })
// }
// )
app.post("/user", (req, res) => {
    const body = req.body;
    console.log(body)
    fs.readFile("./data/user.json", (readError, data) => {
        if (readError) {
            res.json({
                status: "read file error",
            })
        }
        let savedData = JSON.parse(data)
        const newUser = {
            id: Date.now().toString(),
            username: body.username,
            age: body.age,
            pass: body.pass,
        }
        savedData.push(newUser);
        fs.writeFile("./data/user.json", JSON.stringify(savedData),
            (writeError) => {
                if (writeError) {
                    res.json({
                        status: "error"
                    })
                } else {
                    res.json({
                        status: "succes",
                        data: savedData,
                    })
                }
            }
        )
    })
})
app.get("/user", (req, res) => {
    fs.readFile("./data/user.json", (readError, data) => {
        let savedData = JSON.parse(data);
        if (readError) {
            res.json({
                status: "read file error",
            })
        }
        res.json({
            status: "succes",
            data: savedData,
        })
    })
})
app.put("/user", (req, res) => {
    const body = req.body;
    fs.readFile("./data/user.json", (readError, data) => {
        let savedData = JSON.parse(data);
        if (readError) {
            res.json({
                status: "read file error",
            })
        }
        const updateData = savedData.map((d) => {
            if (d.id === body.id) {
                (d.username = body.username),
                    (d.age = body.age),
                    (d.pass = body.pass)
            }
            return d;
        })
        fs.writeFile(
            "./data/user.json",
            JSON.stringify(updateData),
            (writeError) => {
                if (writeError) {
                    res.json({
                        status: "error"
                    })
                } else {
                    res.json({
                        status: "succes",
                        data: updateData,
                    });
                }
            }
        )
    })
})
app.delete("/user", (req, res) => {
    const body = req.body;
    fs.readFile("./data/user.json", (readError, data) => {
        let savedData = JSON.parse(data);
        if (readError) {
            res.json({
                status: "read file error",
            })
        }
        const deleteData =
            savedData.filter((d) => d.id !== body.id);
        fs.writeFile(
            "./data/user.json",
            JSON.stringify(deleteData),

            (writeError) => {
                if (writeError) {
                    res.json({
                        status: "error"
                    })
                }
                res.json({
                    status: "success",
                    data: deleteData,
                })
            }
        )
    })
})
app.post('/login', (req, res) => {
    const { username, password } = req.body;


    console.log(username, typeof password);
    fs.readFile('./data/user.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
            return;
        }
        const users = JSON.parse(data);
        const user = users.find(user => user.username == username && user.password == password);
        console.log(user);
        console.log(users);

        if (user) {
            res.json({ status: 'success', user: { username: user.username, age: user.age } });
        } else {
            res.status(401).json({ status: 'error', message: 'sodo' });
        }
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
