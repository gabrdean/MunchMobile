import { useState } from "react";
import { thunkLogin, thunkSignup } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import "./LoginForm.css"; // Import the updated CSS

function LoginFormPage({ isLogin, isSignup }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [name, setName] = useState("");
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    if (sessionUser && !sessionUser.guestAccount) return <Navigate to="/" replace={true} />;

    const demoSubmit = async (e, name) => {
        e.preventDefault();
        if (name === 'burak') {
            await dispatch(thunkLogin({ email: 'b@user.io', password: 'password' }));
        } else if (name === 'gabe') {
            await dispatch(thunkLogin({ email: 'g@user.io', password: 'password' }));
        } else if (name === 'katie') {
            await dispatch(thunkLogin({ email: 'k@user.io', password: 'password' }));
        } else if (name === 'mar') {
            await dispatch(thunkLogin({ email: 'm@user.io', password: 'password' }));
        } else if (name === 'sama') {
            await dispatch(thunkLogin({ email: 's@user.io', password: 'password' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const userSubmission = { password };

        if (credential === "") {
            return setErrors({ credential: "Please enter a valid email or phone number", type: 'credential; None' });
        } else if (credential.includes("@")) {
            if (credential.split('@')[1].includes('.')) userSubmission.email = credential;
        } else if (credential.includes('-') || credential.length === 10) {
            let phoneNumber = credential;
            if (phoneNumber.includes('-')) phoneNumber = phoneNumber.split('-').join('');
            if (phoneNumber.length !== 10) return setErrors({ credential: "Please enter a valid email or phone number", type: 'phone; Invalid' });
            userSubmission.phone_number = phoneNumber;
        }

        if (name.includes(' ')) {
            const nameSplit = name.split(' ');
            userSubmission.first_name = nameSplit[0];
            userSubmission.last_name = nameSplit[nameSplit.length - 1];
        } else {
            userSubmission.first_name = name;
        }

        if (!(userSubmission.email || userSubmission.phone_number)) {
            return setErrors({ credential: "Please enter a valid email or phone number", type: 'credential; No valid email or phone number' });
        }

        let serverResponse;
        if (isLogin) serverResponse = await dispatch(thunkLogin(userSubmission));
        if (isSignup) {
            userSubmission.wallet = 999.99;
            console.log("SIGNUP USER: ", userSubmission)
            serverResponse = await dispatch(thunkSignup(userSubmission));
        }

        if (serverResponse) {
            if (serverResponse.phone_number) setErrors({ credential: serverResponse.phone_number });
            else if (serverResponse.email) setErrors({ credential: serverResponse.email });
        } else {
            navigate("/");
        }
    };

    let button;
    if (isLogin) button = "Log In";
    if (isSignup) button = "Sign Up";

    return (
        <div className="login-form-page-container">
            <div className="login-form-page-content">
                <form onSubmit={handleSubmit} className="login-form-page-form">
                    {isSignup && (
                        <label className="login-form-page-label">
                            {"What's your name"}
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="login-form-page-input"
                            />
                        </label>
                    )}
                    <label className="login-form-page-label">
                        {"What's your phone number or email"}
                        <input
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                            className="login-form-page-input"
                        />
                    </label>
                    {errors.credential && <p className="login-form-page-error">{errors.credential}</p>}
                    <label className="login-form-page-label">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="login-form-page-input"
                        />
                    </label>
                    {errors.password && <p className="login-form-page-error">{errors.password}</p>}
                    <button type="submit" className="login-form-page-submit-button">{button}</button>
                </form>

                {isLogin && (
                    <div>
                        <div className="login-form-page-divider">or</div>
                        <button
                            className="login-form-page-demo-button"
                            onClick={(e) => {
                                setCredential('b@user.io');
                                setPassword('password');
                                demoSubmit(e, 'burak');
                            }}>
                            Login as Burak
                        </button>
                        <button
                            className="login-form-page-demo-button"
                            onClick={(e) => {
                                setCredential('g@user.io');
                                setPassword('password');
                                demoSubmit(e, 'gabe');
                            }}>
                            Login as Gabe
                        </button>
                        <button
                            className="login-form-page-demo-button"
                            onClick={(e) => {
                                setCredential('k@user.io');
                                setPassword('password');
                                demoSubmit(e, 'katie');
                            }}>
                            Login as Katie
                        </button>
                        <button
                            className="login-form-page-demo-button"
                            onClick={(e) => {
                                setCredential('m@user.io');
                                setPassword('password');
                                demoSubmit(e, 'mar');
                            }}>
                            Login as Mar
                        </button>
                        <button
                            className="login-form-page-demo-button"
                            onClick={(e) => {
                                setCredential('s@user.io');
                                setPassword('password');
                                demoSubmit(e, 'sama');
                            }}>
                            Login as Sama
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginFormPage;