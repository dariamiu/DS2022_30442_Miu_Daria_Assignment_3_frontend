import { useState } from 'react'
import { useNavigate } from "react-router-dom"
const AdminAddClient = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

	
    const navigate = useNavigate()


	const onClickRegister = async () => {
		console.log(username)
		console.log(password)


		const data = {
			username: username,
			password: password
		}

		const addCustomer = async (data) => {
			const res = await fetch(`http://localhost:8080/energy_utility_platform/client/add`, {
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.catch(error=>{ return error.response; })
			alert(res.message)
		}

		if(!username){
			alert("Enter username!")
			return
		}
		if(!password){
			alert("Enter password!")
			return
		}
		addCustomer(data);
        setPassword("")
        setUsername("")
	}

    const onLogOutSubmit = (e) => {
        e.preventDefault()

        navigate('/', {
        })
    }
    
    return (
        <div>
            <div className = "row">
                <div className="greenTitle" style={{marginLeft : 50, fontSize : 50}}>Energy Utility Platform</div>
                <button className = "btn" style = {{marginLeft : 1000}} type="submit" id='btn-log-out' onClick={(e) => onLogOutSubmit(e)}>
                    Log out
                </button>
            </div>
            <hr></hr>
            <div className='containerWithBorder'>
                <h1 className='coloredLoginTitle'>Add Customer</h1>
                <form className="add-form">
                    <div className="form-control">
                        <label> Username </label>
                        <input  type="text"
                                placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label> Password </label>
                        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    </form>
                    <div>
                        <button onClick={(e) => onClickRegister(e)} class="btn btn-primary btn-block" type="submit">Register</button>
                    </div>
            </div>
      </div>
    )
};

export default AdminAddClient