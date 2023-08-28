import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Stack, TextField } from "@mui/material";
import Heading from "../../../../components/Heading";
import { useDispatch } from "react-redux";
import { authActions } from "../../../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../../components/share/CustomButton";

interface FormValues {
  email: string;
}

const SendEmail = ({ onNext }: { onNext: () => void }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email("Invalid email").required("Insert email"),
      })
    ),
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    // dispatch(
    //   authActions.login({
    //     params: data,
    //     onNavigate: () => {
    //       navigate("/home");
    //     },
    //   })
    // );
    console.log({ data });
    onNext();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" gap="16px">
        <Heading
          title="Forgot password?"
          subtitle="Don't worry, enter your email"
        />
        <TextField
          id="email"
          label="Email"
          inputProps={{ ...register("email") }}
          error={!!errors.email?.message}
          required
          helperText={errors.email?.message}
        />
        <CustomButton color="primary" type="submit" label="Send" />
      </Stack>
    </form>
  );
};

export default SendEmail;