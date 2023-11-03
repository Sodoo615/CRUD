"use client"
import { useEffect, useState } from 'react'
export default function Home() {
  const [users, setUsers] = useState([])
  const [username, setName] = useState("")
  const [age, setAge] = useState("")
  const [pass, setPassword] = useState("")

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [updateName, setUpdateName] = useState('');
  const [updatePass, setUpdatePass] = useState('');
  const [updateAge, setUpdateAge] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const BE_url = 'http://localhost:8080/user';
  useEffect(() => {
    fetchAllData();
  }, [])

  async function fetchAllData() {
    const FETCHED_DATA = await fetch(`${BE_url}`)
    const FETCHED_JSON = await FETCHED_DATA.json()
    setUsers(FETCHED_JSON.data)
    console.log(FETCHED_JSON)
  }
  async function HandleSubmit(e) {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        age: age,
        pass: pass,
      }),
    };

    const response = await fetch(`${BE_url}`, options);
    const data = await response.json();
    if (data.status === 'success') {
      setUsers(data.data);
      setName('');
      setAge('');
      setPassword('');
    } else {
      console.error('Error adding user:', data.status);
    }
  }

  async function HandleDelete(id) {
    const options = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    };

    const response = await fetch(`${BE_url}`, options);
    const data = await response.json();

  }

  async function handleUpdate(id) {
    setSelectedUserId(id);
    const userToUpdate = users.find(user => user.id === id);
    setUpdateName(userToUpdate.username);
    setUpdateAge(userToUpdate.age);
  }

  async function submitUpdate(e) {
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedUserId,
        username: updateName,
        age: updateAge,
      }),
    };

    const response = await fetch(`${BE_url}`, options);
    const data = await response.json();
  }
  function handleLogout() {
    setLoggedInUser(null)
  }
  async function handleLogin(username, password) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        pass: pass
      }),
    };

    const response = await fetch(`http://localhost:8080/login`, options);
    const data = await response.json();

    console.log('data', data);

    if (data.status === 'success') {
      setLoggedInUser(data.user);
    } else {
      alert('Ajillahgvi bnshdee hooy');
    }
  }

  console.log(users)
  return (
    <div className='p-[10px]'>
      <h1 style={{ fontSize: "88px" }} >User-CRUD with FS module</h1>
      {loggedInUser ? (
        <div>
          <h2>Welcome to Guys <br></br> name : {loggedInUser.username}</h2>
          <p>Age: {loggedInUser.age}</p>
          <button onClick={() => handleLogout()}>Logout</button>
        </div>
      ) : (
        <div>
          <div className=" flex gap-[40px]"  >
            <label className=" flex gap-[10px]" >
              Username:
              <input value={username} onChange={(e) => setName(e.target.value)} className='bg-[#ccc] w-[100px ] h-[30px]' name="username" />
            </label>
            <label className=" flex gap-[10px]">
              Age:
              <input value={age} onChange={(e) => setAge(e.target.value)} className='bg-[#ccc]' name="age" />
            </label>
            <label className=" flex gap-[10px]">
              password:
              <input value={pass} onChange={(e) => setPassword(e.target.value)} className='bg-[#ccc]' name='password' type="password" />
            </label>
            <button type='submit' onClick={(e) => HandleSubmit()} className='bg-[#ccc] w-[80px]  rounded-full'>Submit</button>
          </div>
          <h1 className='text-xl text-amber-900'>User List : </h1>
          {users.map((user) => (
            <div className='  p-[10px] text-green-600   ' key={user.id}>
              NAME : {user.username} ----------------- AGE : {user.age}
              <button className='ml-[80px] w-[80px] h-[30px] text-cyan-400 bg-[#555]' onClick={() => HandleDelete(user.id)} > delete </button>
              <button className='ml-[80px] text-cyan-800 bg-[#ccc] w-[80px] h-[30px]' onClick={() => handleUpdate(user.id)} > update </button>
              {selectedUserId === user.id && (
                <div >
                  <label>
                    name:
                    <input
                      name="updateName"
                      value={updateName}
                      onChange={(e) => setUpdateName(e.target.value)}
                    />
                  </label>
                  <label>
                    age:
                    <input
                      name="updateAge"
                      value={updateAge}
                      onChange={(e) => setUpdateAge(e.target.value)}
                    />
                  </label>
                  <button onClick={(e) => submitUpdate()} type="submit">Save</button>
                </div>
              )}
              <div>
                <label>
                  pass:
                  <input
                    name="loginPassword"
                    type='password'
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </label>
                <button className='ml-[80px] text-cyan-800 bg-[#ccc] w-[80px] h-[30px]' onClick={() => handleLogin(user.username, loginPassword)}> Login </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>

  )
}
