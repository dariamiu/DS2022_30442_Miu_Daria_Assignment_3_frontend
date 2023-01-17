import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import Device from './Devices'

const AdminManageDevices= () => {

    const [devices, setDevices] = useState([])

    const navigate = useNavigate()
    const [deviceSearch, setDeviceSearch] = useState("")
    const [isShown, setIsShown] = useState('')
    const [currentId, setCurrentId] = useState('')

    const [maxC, setMaxC] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [client, setClient] = useState('')

    const fetchDevices = async() => {
        const res = await fetch(`http://localhost:8080/energy_utility_platform/devices/view`)
        const data = await res.json()
        console.log(data)
        return data
    }

    useEffect(() =>{
        const getDevices = async() => {
            const devicesLocal = await fetchDevices()
            setDevices(devicesLocal)
        }
        getDevices()       
    },[])


    const onLogOutSubmit = (e) => {
        e.preventDefault()
        navigate('/', {
        })
    }
   

    const goToDevice = ({device, e}) => {
        console.log(device.description)

        e.preventDefault()
    
        
        setIsShown(true);
        setMaxC(device.max_h_cons)
        setDescription(device.description)
        setClient(device.clientName)
        setAddress(device.address)
        setCurrentId(device.id_device)

    }
    const onClickClose = (e) =>{
        e.preventDefault()
        setIsShown(false)
    }

    const onClickModify = async() => {
        if(description === ''){
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

        const data = {
            id_device : currentId,
			description: description,
			address: address,
            clientName : client,
            max_h_cons : maxC
		}
        const res = await fetch(`http://localhost:8080/energy_utility_platform/devices/update`, {
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
        const res = await fetch(`http://localhost:8080/energy_utility_platform/devices/delete/${currentId}`, {
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
        return rows.filter((row)=> row.clientName?.toLowerCase().indexOf(deviceSearch.toLowerCase()) > -1)
    }
    const patients2 = search(devices)
   

    return(
        <div>
            { isShown && 
                <div className='show-details' id="show-details-id">
                    <button onClick={(e) => onClickClose(e)} className = "btn" style = {{marginLeft : 700}} >
                        Close
                    </button>
                    <div className='containerWithBorder'>
                        <h1 className='coloredLoginTitle'>Edit Device</h1>
                        <form className="add-form">
                            <div className="form-control">
                                <label> Description </label>
                                <input  type="text" placeholder="Enter description" value={description} defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label> Maximum Consumption </label>
                                <input  type="text"
                                placeholder="Enter max consumption" value={maxC} onChange={(e) => setMaxC(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label> Address </label>
                                <input type="text" placeholder="Enter address" value={address} defaultValue={address} onChange={(e) => setAddress(e.target.value)}/>
                            </div>
                            <div className="form-control">
                                <label> Client </label>
                                <input type="text" placeholder="Enter client username" value={client} defaultValue={client} onChange={(e) => setClient(e.target.value)}/>
                            </div>
                        </form>
                        <div>
                            <button onClick={(e) => onClickModify(e)} class="btn btn-primary btn-block" type="submit">Save Device</button>
                            <button onClick={(e) => onClickDelete(e)} class="btn btn-primary btn-block" type="submit">Delete Device</button>
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
                       placeholder="Client username" value={deviceSearch} onChange={(e) => setDeviceSearch(e.target.value)}/>  
            </div>
            <div>
                <div className = "container-2">
                    <div>
                        <h1 style={{marginLeft : 10}} className="details greenTitle"> All Devices</h1>
                        <br></br>
                        <div>
                            {patients2?.map((device, index) => (
                                <Device key ={index} device = {device} onClick = {(e) => goToDevice({device, e})}/>
                            ))}
                        </div>  
                    </div>
                </div>
            </div>
      </div>
      


    )
 
}

export default AdminManageDevices
