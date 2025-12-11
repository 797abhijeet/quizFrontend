import {GoogleLogout} from 'react-google-login'

const clientId="611812440316-um4nib3o8g847obk2je3j2gdm1jtbmls.apps.googleusercontent.com";

function Logout(){
    const onSuccess =()=>{
        console.log("Log Out Successful!");
    }
    return (
        <div id="signOutButton">
        <GoogleLogout
        clientId={clientId}
        buttonText={"Logout"}
        onLogoutSuccess={onSuccess}
        />
        </div>
    );
}
export default Logout;