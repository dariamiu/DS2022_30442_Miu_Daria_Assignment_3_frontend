import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import Client from './Clients'

const AdminManageClients= () => {

    const [clients, setClients] = useState([])

    const navigate = useNavigate()
    const [clientsSearch, setClientsSearch] = useState("")
    const [isShown, setIsShown] = useState('')

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [currentUsername, setCurrentUsername] = useState('')



    const fetchClients = async() => {
        const res = await fetch(`http://localhost:8080/energy_utility_platform/clients/view`)
        const data = await res.json()
        console.log(data)
        return data
    }

    useEffect(() =>{
        const getClients = async() => {
            const clientsLocal = await fetchClients()
            setClients(clientsLocal)
            //setDevicesCopy(devicesLocal)
        }
        getClients()       
    },[])


    const onLogOutSubmit = (e) => {
        e.preventDefault()
        navigate('/', {
        })
    }
   

    const goToClient = ({client, e}) => {
        console.log(client.description)
        //console.log(state.client)
        e.preventDefault()
        // navigate('/admin/device-edit', {
        //     state : {
        //         device : device.description,
        //        // client : state.client
        //     }
        // })

        setIsShown(true);
        setUsername(client.username)
        setPassword("no")
        setCurrentUsername(client.username)

    }
    const onClickClose = (e) =>{
        e.preventDefault()
        setIsShown(false)
    }

    const onClickModify = async() => {
        if(!username){
			alert("Enter username!")
			return
		}
		if(!password){
			alert("Enter password!")
			return
		}
        console.log(password)
        var passwordChanged = 1
        if(password === "no"){
            passwordChanged = 0
        }

        const data = {
			oldUsername: currentUsername,
            newUsername : username,
			password: password,
            passwordChanged : passwordChanged
		}
        console.log(currentUsername)
        console.log(username)
        console.log(password)
        console.log(passwordChanged)
        const res = await fetch(`http://localhost:8080/energy_utility_platform/clients/update`, {
            method: "PUT",
            body : JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            },
          
        })
		.then(response => response.json())
		.catch(error=>{return error.response;})
		alert(res.message)
        window.location.reload(false);
        setIsShown(false)
    }

    const onClickDelete = async() => {
        const res = await fetch(`http://localhost:8080/energy_utility_platform/clients/delete/${username}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            },
          
        })
		.then(response => response.json())
		.catch(error=>{return error.response;})
		alert(res.message)
        window.location.reload(false);
        setIsShown(false)
    }
    

    function search(rows){
        return rows.filter((row)=> row.username?.toLowerCase().indexOf(clientsSearch.toLowerCase()) > -1)
    }
    const patients2 = search(clients)



    return(
        <div>
            { isShown && 
                <div className='show-details' id="show-details-id">
                    <button onClick={(e) => onClickClose(e)} className = "btn" style = {{marginLeft : 700}} >
                        Close
                    </button>
                    <div className='containerWithBorder'>
                        <h1 className='coloredLoginTitle'>Edit Client</h1>
                        <form className="add-form">
                            <div className="form-control">
                                <label> Username </label>
                                <input  type="text" placeholder="Enter description" value={username} defaultValue={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label> Password </label>
                                <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </form>
                        <div>
                            <button onClick={(e) => onClickModify(e)} class="btn btn-primary btn-block" type="submit">Save Client</button>
                            <button onClick={(e) => onClickDelete(e)} class="btn btn-primary btn-block" type="submit">Delete Client</button>
                        </div>
                    </div>
                </div>
            }
            <div className = "row">
                 <div className='greenTitle' style={{ marginLeft : 50, fontSize : 50}}>Energy Utility Platform</div>
                 <button className = "btn" style = {{marginLeft : 1000}} type="submit" id='btn-log-out' onClick={(e) => onLogOutSubmit(e)}>
                    Log out
                 </button>
            </div>
            <hr></hr>
            <div className='form-control-s container-search'>
                <input type="text"
                       placeholder="Client username" value={clientsSearch} onChange={(e) => setClientsSearch(e.target.value)}/>
              
            </div>
            <div>
                <div className = "container-2">
                    <div>
                        <h1 style={{marginLeft : 10}} className="details greenTitle"> All Devices</h1>
                        <br></br>
                        <div>
                            {patients2?.map((client, index) => (
                                <Client key ={index} client = {client} onClick = {(e) => goToClient({client, e})}/>
                            ))}
                        </div>  
                    </div>
                </div>
            </div>
      </div>
      


    )
 
}

export default AdminManageClients
