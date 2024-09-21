import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const initialState = {
  phoneNo: "",
  password: "",
};




function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const location = useLocation();
  const [phoneNo, setPhoneNo] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const phoneNo = searchParams.get('phoneNo');
    setPhoneNo(phoneNo)
    const password = searchParams.get('password');
    setPassword(password)

    console.log("Phone: " + phoneNo);
    console.log("Password: " + password);
  }, [location]);

  // const {phoneNo, password} = req.query.params;
  // console.log(phoneNo)
  // console.log(password)
  

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        phoneNo={phoneNo}
        password={password}
      />
    </div>
  );
}

export default AuthLogin;
