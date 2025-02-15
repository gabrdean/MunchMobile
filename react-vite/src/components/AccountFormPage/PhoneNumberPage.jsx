import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {editUserThunk} from "../../redux/session"

function PhoneNumberPage(){
    const user = useSelector((store) => store.session.user);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // console.log({
    //     phoneNumber,
    //     errors
    // })

    if(!user) navigate('/login')

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setErrors({})

        let phoneNo
        if(phoneNumber.includes('-')){
            phoneNo = phoneNumber.split('-').join('')
        } else phoneNo = phoneNumber
        console.log(phoneNo)

        if(isNaN(Number(phoneNo))){
            return setErrors({phone: "Phone number must have only numbers in it"})
        }
        else if(phoneNo.length !== 10){
            return setErrors({phone: "Phone number must have 10 digits"})
        }
        // console.log({
        //     phoneNumber,
        //     phoneNo,
        //     PhoneNumber: Number(phoneNo)
        // })


        const server = await dispatch(editUserThunk({phone_number: phoneNo, id: user.id}))
        if(server){
            console.log(server)
            return setErrors({phone: server})
        } else {
            navigate('/account')
        }
    }

    return (
			<div>
				<h1>Phone Number</h1>
				{"You'll use this number sign in"}
				<input
					type='text'
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
				/>
				{errors && <p>{errors.phone}</p>}
				<button className='auth-buttons' onClick={(e) => handleSubmit(e)}>
					Update
				</button>
			</div>
		);
}


export default PhoneNumberPage