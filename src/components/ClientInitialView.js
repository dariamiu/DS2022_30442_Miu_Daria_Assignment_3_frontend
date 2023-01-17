import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import Device from './Devices'
import { useLocation } from "react-router-dom"
import DatePicker from "react-datepicker";
import moment from 'moment';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
import { User} from "../chat_pb";
import { ChatServiceClient } from "../chat_grpc_web_pb";
import "react-datepicker/dist/react-datepicker.css";
import {over} from 'stompjs'
import SockJS from 'sockjs-client'

var stompClient = null;

const ClientInitialView= () => {
    const chat_user = new ChatServiceClient("http://localhost:8081", null, null);
    const [devices, setDevices] = useState([])

    const navigate = useNavigate()
    const [deviceSearch, setDeviceSearch] = useState("")
    const [isShown, setIsShown] = useState('')
    const [currentId, setCurrentId] = useState('')

    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [client, setClient] = useState('')
    const {state} = useLocation()
    const [startDate, setStartDate] = useState(new Date());

    const[chartData, setChartData] = useState('')

    const fetchDevices = async() => {
        const res = await fetch(`http://localhost:8080/energy_utility_platform/client/devices/view/${state.client}`)
        const data = await res.json()
        console.log(data)
        return data
    }

    const onMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body)
        alert(payloadData.message)
    }

    const onConnected = () => {
        stompClient.subscribe(`/topic/notification/${state.client}`, onMessageReceived);
    }

    const onError = (error) => {
        console.log(error)
    }

    useEffect(() =>{
        const getDevices = async() => {
            const devicesLocal = await fetchDevices()
            setDevices(devicesLocal)
            //setDevicesCopy(devicesLocal)
        }
        getDevices() 

        let Sock = new SockJS(`http://localhost:8080/energy_utility_platform/socket`);
        stompClient = over(Sock);

        stompClient.connect({},onConnected,onError)

        let Sock_typing = new SockJS(`http://localhost:8080/energy_utility_platform/socket`)

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
        setDescription(device.description)
        setClient(device.clientName)
        setAddress(device.address)
        setCurrentId(device.id_device)

    }

    const onClickClose = (e) =>{
        e.preventDefault()
        setIsShown(false)
    }


    const onClickShowChart = async() => {

        var day
        var month
        if(startDate.getMonth() + 1 < 10){
            month = `0${startDate.getMonth() + 1}`
        } else {
            month = `${startDate.getMonth() + 1}`
        }
        if(startDate.getDate()< 10){
            day = `0${startDate.getDate()}`
        } else {
            day = `${startDate.getDate()}`
        }
        let formattedDate = `${startDate.getFullYear()}-${
            month
          }-${day}`;
    
        console.log(formattedDate)
        const date = startDate.getFullYear.toString() + '-' +  month + '-' + day 
        console.log(date)
        const dailyConsumption = {
            idDevice : currentId,
            date : formattedDate
        }
        const dc = JSON.stringify(dailyConsumption)
        const res = await fetch(`http://localhost:8080/energy_utility_platform/device/daily-consumption/${dc}`)
        const data = await res.json()
        console.log(data)
        setChartData(data)
        
    }

    const onClickChat = async(e) => {
        e.preventDefault()
        joinHandler()
        navigate('/client/chat-page',
        {
            state: {
                name :state.client,
                chat_user : chat_user
            }
        })
    }
    
    
    function joinHandler() {
    
        const user = new User();
        user.setId(Date.now());
        user.setName(state.client);
    
        chat_user.join(user, null, (err, response) => {
        });
      }


    function search(rows){
        return rows.filter((row)=> row.description?.toLowerCase().indexOf(deviceSearch.toLowerCase()) > -1)
    }
    const patients2 = search(devices)

    return(
        <div>
            { isShown && 
                <div className='show-chart' id="show-details-id">
                    <button onClick={(e) => onClickClose(e)} className = "btn" style = {{marginLeft : 1100}} >
                        Close
                    </button>
                    <div style = {{marginLeft : 500}}>
                        <DatePicker maxDate={moment().toDate()} selected={startDate} onChange={(date) => setStartDate(date)} />
                        <button onClick={(e) => onClickShowChart(e)} className = "btn" style = {{marginLeft : 20}} > Show Chart </button>
                    </div>
                    <hr></hr>
                    <LineChart yLabel="kW"style={{marginLeft : 80, marginTop: 80}} width={1000} height={300} data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                         <Line type="monotone" dataKey="consumption" stroke="#000000" />
                         <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                         <XAxis dataKey="timeStamp" />
                         <YAxis />
                         <Tooltip />
                    </LineChart>
                    <label style = {{marginLeft : 130, color:	'#737373'}}>
                        00&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;01&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;02&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;03&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;04&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        05&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;06&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;07&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;08&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;09&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                        16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        21 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </label>
                </div>
            }
            <div className = "row">
                 <div className='greenTitle' style={{ marginLeft : 50, fontSize : 50}}>Energy Utility Platform</div>
                 <button onClick={(e) => onClickChat(e)} class="btn" type="submit" style = {{marginLeft : 950}}>
                    Chat
                </button>
                 <button className = "btn" style = {{marginLeft : 10}} type="submit" id='btn-log-out' onClick={(e) => onLogOutSubmit(e)}>
                    Log out
                 </button>
            </div>
            <hr></hr>
            <div className='form-control-s container-search'>
                <input type="text"
                       placeholder="Device description" value={deviceSearch} onChange={(e) => setDeviceSearch(e.target.value)}/>
              
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

export default ClientInitialView
