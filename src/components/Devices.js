const Device = ({device, onClick}) =>{
    console.log(device.description)
    return(
        <div>
            <div className = "speciality" onClick={onClick}>
                <h3>
                    {"Device: " + device.description}
                </h3>
                <h3>
                    {"Address: " + device.address}
                </h3>
                <h3>
                    {"Client: " + device.clientName}
                </h3>
            </div>
        </div>
    )
}

export default Device