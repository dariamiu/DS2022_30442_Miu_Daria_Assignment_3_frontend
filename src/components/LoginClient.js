import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LoginClient = () => {
	const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

	
    const navigate = useNavigate()


	const onClickSave = async () =>{
	 console.log(username)
     console.log(password)


	const data = {
	username: username,
    password: password
    }

	const loginCustomer = async (url) => {
		const res = await fetch(`http://localhost:8080/energy_utility_platform/client/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
		.then(response => response.json())
		.catch(error=>{ return error.response; })
		console.log(res.success)

		if(res.success){
			console.log(username)
            navigate('/client/initial-view', {
                state: {
                    client : username
                }
            })
        }else{
			alert(res.message)
		}
    }

	loginCustomer(data);

	};


    return (
		<div className='containerWithBorder'>
			<h1 className='coloredLoginTitle'>Login Client</h1>
			<form className="add-form">
				<div className="form-control">
					<label> Email </label>
					<input  type="text"
							placeholder="Enter email" value={username} onChange={(e) => setUsername(e.target.value)} />
				</div>
				<div className="form-control">
					<label> Password </label>
					<input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
				</div>
			</form>
			<div>
				<button onClick={(e) => onClickSave(e)} class="btn btn-primary btn-block" type="submit">Login</button>
			</div>
      </div>
    )
};



export default LoginClient
