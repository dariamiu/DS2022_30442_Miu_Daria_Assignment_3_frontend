import { useState } from 'react'
import { useNavigate } from "react-router-dom"
const AdminAddDevice = () => {

    const [description, setDescription] = useState('')
    const [maxC, setmaxC] = useState('')
    const [address, setAddress] = useState('')
    const [client, setClient] = useState('')
	
    const navigate = useNavigate()


	const onClickRegister = async () => {
	

		console.log(description)
		console.log(address)


		const data = {
			description: description,
			address: address,
            clientName : client,
            max_h_cons : maxC
		}
		const addDevice = async (data) => {
			const res = await fetch(`http://localhost:8080/energy_utility_platform/device/add`, {
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

		if(!description){
			alert("Enter description!")
			return
		}
		if(!address){
			alert("Enter address!")
			return
		}
        if(!client){
            alert("Enter client username!")
            return
        }

        
		addDevice(data);
        setDescription("")
        setAddress("")
        setClient("")
        setmaxC("")
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
                <h1 className='coloredLoginTitle'>Add Device</h1>
                <form className="add-form">
                    <div className="form-control">
                        <label> Description </label>
                        <input  type="text"
                                placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label> Maximum Consumption </label>
                        <input  type="text"
                                placeholder="Enter max consumption" value={maxC} onChange={(e) => setmaxC(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label> Address </label>
                        <input type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)}/>
                    </div>
                    <div className="form-control">
                        <label> Client </label>
                        <input type="text" placeholder="Enter client username" value={client} onChange={(e) => setClient(e.target.value)}/>
                    </div>
                </form>
                <div>
                    <button onClick={(e) => onClickRegister(e)} class="btn btn-primary btn-block" type="submit">Save Device</button>
                </div>
            </div>
      </div>
    )
};

export default AdminAddDevice