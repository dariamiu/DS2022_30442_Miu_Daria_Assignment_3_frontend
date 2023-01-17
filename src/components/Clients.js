const Client = ({client, onClick}) =>{
    console.log(client.username)
    return(
        <div>
            <div className = "speciality" onClick={onClick}>
                <h3>
                    {"Username : " + client.username}
                </h3>
            </div>
        </div>
    )
}

export default Client