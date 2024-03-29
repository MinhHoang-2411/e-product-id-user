import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import BaseModal from "../BaseModal";
import Heading from "../../Heading";
import {
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { layoutActions } from "../../../store/layout/layoutSlice";
import { consignmentActions } from "../../../store/organizer/consignment/consignmentSlice";
import CustomButton from "../../share/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ImageUpload from "../../organizer/product/ImageUpload";
import { countTotalElements } from "../../../utils/share";
import DropzoneCustom from "../../share/dropzone/DropzoneCustom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { chainsActions } from "../../../store/organizer/chains/chainsSlice";
import TimePicker from "../../share/input/TimePicker";

// enum STEPS {
//   DESCRIPTION = 0,
//   CHAIN = 1,
//   REVIEW = 2,
// }

interface FieldValues {
  name: string;
  description: string;
  images?: any;
  consignment_id?: any;
  date_start: any;
  payload: { name: string; value: string }[] | undefined;
}
const CreateChainsModal = () => {
  const theme = useTheme();
  const [date, setDate] = useState(dayjs(new Date()));
  const isOpenModal = useAppSelector((state) => state.layout.isOpenChainsModal);
  const consignmentDetail = useAppSelector(
    (state) => state.consignment.consignmentDetail
  );
  const dispatch = useAppDispatch();
  // const [step, setStep] = useState(STEPS.DESCRIPTION);
  // const [fields, setFields] = useState([{ id: 0, deleted: false }]); // Mảng các field
  const [payloadFields, setPayloadFields] = useState<
    {
      name: string;
      value: string;
    }[]
  >([]);
  const addField = () => {
    const fields = getValues("payload") || [];
    const cleanedFields = fields.filter(
      (field: { name: string; value: string }) =>
        field.name !== undefined && field.value !== undefined
    );
    cleanedFields.push({ name: "", value: "" });
    setValue("payload", cleanedFields);
    setPayloadFields(cleanedFields);
  };

  const removeField = (index: number) => {
    const fields = getValues("payload") || [];
    fields.splice(index, 1);
    setPayloadFields(fields);
    setValue("payload", fields);
    fields.forEach((field: { name: string; value: string }, idx: number) => {
      setValue(`payload.${idx}.name`, field.name);
      setValue(`payload.${idx}.value`, field.value);
    });
  };

  const resetField = () => {
    setValue("payload", []);
    setPayloadFields([]);
  };
  //==========================================================handle upload imgs//==========================================================
  const listImage = useAppSelector((state) => state.chains.temporarylistImgUrl);
  const listStepImage = useAppSelector(
    (state) => state.chains.temporarylistStepImgUrl
  );
  const loadingCreateChains = useAppSelector(
    (state) => state.chains.loadingCreateChains
  );
  const uploadTemporaryImages = (listImg: any) => {
    setValue("images", listImg);
    dispatch(chainsActions.settemporarylistImgUrl(listImg));
  };
  // const uploadTemporaryStepImages = (listImg: any, id: number) => {
  //   dispatch(chainsActions.setTemporarylistStepImgUrl({ id, data: listImg }));
  // };
  const plusTemporaryImages = (listImg: any) => {
    dispatch(chainsActions.plusTemporaryListImgUrl(listImg));
  };
  // const plusTemporaryStepImages = (listImg: any, id: number) => {
  //   dispatch(chainsActions.plusTemporarylistStepImgUrl({ id, data: listImg }));
  // };
  const deleteImageUpload = (file: any) => {
    dispatch(chainsActions.deleteATemporaryImgUrl(file));
  };
  // const deleteImageStepUpload = (file: any, id: number) => {
  //   dispatch(chainsActions.deleteATemporarylistStepImgUrl({ id, data: file }));
  // };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    clearErrors,
    trigger,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      images: [],
      consignment_id: null,
      date_start: dayjs(new Date()),
      payload: [] as { name: string; value: string }[],
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("Vui lòng nhập tên công đoạn"),
        description: yup.string().required("Vui lòng nhập mô tả cho công đoạn"),
        // images: yup.array().min(1, "Insert images").required("Insert images"),
        date_start: yup.date().required("Vui lòng chọn ngày"),
        payload: yup.array().of(
          yup.object().shape({
            name: yup
              .string()
              .required("Nhập tên trường")
              .test(
                "is-unique",
                "Tên trường không được trùng nhau",
                function (value) {
                  const originPayload = getValues().payload;
                  const length = originPayload?.filter(
                    (item) => item.name.trim() == value.trim()
                  ).length;
                  if (length && length < 2) {
                    return true;
                  } else {
                    return false;
                  }
                }
              ),
            value: yup.string().required("Nhập giá trị"),
          })
        ),
      })
    ),
  });

  useEffect(() => {
    setValue("images", listImage);
    clearErrors("images");
  }, [listImage]);
  useEffect(() => {
    if (consignmentDetail?.name) {
      setValue("consignment_id", consignmentDetail?.id);
    } else {
      reset();
    }
  }, [consignmentDetail, setValue]);
  const onCloseModal = () => {
    reset();
    resetField();
    dispatch(layoutActions.closeModalChains());
    dispatch(chainsActions.resetTemporarylistImgUrl());
    dispatch(consignmentActions.resetSelectedConsignment());
    if (consignmentDetail?.name) {
      setValue("consignment_id", consignmentDetail?.id);
    }
  };

  const onSubmitOrNext: SubmitHandler<FieldValues> = async (data) => {
    // if (step == STEPS.DESCRIPTION) {
    //   const result = await trigger(["name", "description", "images"]);
    //   if (result) {
    //     setStep(step + 1);
    //   }
    // } else if (step == STEPS.CHAIN) {
    //   const result = await trigger(["payload"]);
    //   if (result) {
    //     setStep(step + 1);
    //   }
    // } else {
    const metadata = data.payload?.reduce((result: any, field) => {
      if (field.name && field.value) {
        result[field.name.trim()] = field.value.trim();
      }
      return result;
    }, {});
    const { payload, ...params } = data;
    const payloadRequest = {
      params,
      formData: listImage,
      metadata,
      consignmentId: consignmentDetail?.id,
      onReset() {
        onCloseModal();
        // if (consignmentDetail?.id) {
        //   dispatch(
        //     consignmentActions.getConsignmentDetail(consignmentDetail?.id)
        //   );
        // }
      },
    };
    dispatch(chainsActions.createChains(payloadRequest));
  };

  // const onSecondaryAction = () => {
  //   if (step !== STEPS.DESCRIPTION) {
  //     setStep(step - 1);
  //   } else {
  //     onCloseModal();
  //   }
  // };

  // const formValues = getValues();

  //==========================================================DESCRIPTION//==========================================================
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Tạo công đoạn mới" />
      <TextField
        id="name"
        label="Tên công đoạn"
        inputProps={{ ...register("name") }}
        error={!!errors.name?.message}
        required
        helperText={errors.name?.message}
        onChange={() => {
          if (errors.name) {
            clearErrors("name"); // Delete error "name" when change input hehe
          }
        }}
      />
      <TextField
        id="description"
        label="Mô tả"
        inputProps={{ ...register("description") }}
        error={!!errors.description?.message}
        required
        helperText={errors.description?.message as string}
        onChange={() => {
          if (errors.description) {
            clearErrors("description");
          }
        }}
      />

      <Controller
        control={control}
        name="date_start"
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <TimePicker
              label="Ngày tháng"
              value={field.value}
              inputRef={field.ref}
              onChange={(date) => {
                field.onChange(date);
              }}
              slotProps={{
                textField: {
                  error: !!errors?.date_start,
                  helperText: errors?.date_start
                    ? "Ngày tháng không hợp lệ"
                    : null,
                },
              }}
            />
          );
        }}
      />
      {/* Option fields */}
      {payloadFields.map((field, index) => (
        <Stack direction="row" gap={1} key={index}>
          {" "}
          <TextField
            id={`name-${index}`}
            label="Tên trường"
            inputProps={{ ...register(`payload.${index}.name`) }}
            InputLabelProps={{ shrink: true }}
            error={
              !!errors.payload &&
              !!errors.payload[index] &&
              !!errors.payload[index]?.name
            }
            required
            helperText={
              !!errors.payload &&
              !!errors.payload[index] &&
              !!errors.payload[index]?.name &&
              errors.payload[index]?.name?.message
            }
            onChange={() => {
              if (errors.payload) {
                trigger(`payload`);
              }
              if (
                !!errors.payload &&
                !!errors.payload[index] &&
                !!errors.payload[index]?.name
              ) {
                clearErrors(`payload.${index}.name`);
                trigger(`payload`);
              }
            }}
          />
          <TextField
            fullWidth
            id={`description-${index}`}
            label="Giá trị"
            inputProps={{
              ...register(`payload.${index}.value`),
            }}
            InputLabelProps={{ shrink: true }}
            error={
              !!errors.payload &&
              !!errors.payload[index] &&
              !!errors.payload[index]?.value
            }
            required
            helperText={
              !!errors.payload &&
              !!errors.payload[index] &&
              !!errors.payload[index]?.value &&
              errors.payload[index]?.value?.message
            }
            onChange={() => {
              if (
                !!errors.payload &&
                !!errors.payload[index] &&
                !!errors.payload[index]?.value
              ) {
                clearErrors(`payload.${index}.value`);
              }
            }}
          />
          <CustomButton
            onClick={() => {
              removeField(index);
              if (errors.payload) {
                trigger(`payload`);
              }
            }}
            label=""
            color="error"
            Icon={<DeleteIcon />}
            width="50px"
            height="50px"
          />
        </Stack>
      ))}
      <CustomButton
        width="220px"
        onClick={addField}
        label="Thêm trường tùy chọn"
        color="primary"
        Icon={<AddIcon />}
      />
      <Stack
        gap={1}
        sx={{
          border: `1px solid ${
            errors.images?.message ? theme.palette.error.main : "#ccc"
          }`,
          p: 2,
          borderRadius: 1,
        }}
      >
        <b>{`Thêm ảnh (Tối đa: 4)`}</b>
        {errors.images?.message ? (
          <FormHelperText error>
            {errors.images?.message as string}
          </FormHelperText>
        ) : (
          <></>
        )}

        <Stack direction="row" gap={1}>
          {listImage.length
            ? listImage.map((img: any, i: number) => (
                <ImageUpload
                  key={i}
                  width="25%"
                  src={img.preview}
                  onDelete={() => {
                    deleteImageUpload(img);
                  }}
                />
              ))
            : null}
          {!!listImage.length && countTotalElements(listImage) < 4 ? (
            <DropzoneCustom
              Icon={AddCircleOutlineIcon}
              maxFile={
                4 - countTotalElements(listImage) > 1
                  ? 4 - countTotalElements(listImage)
                  : 1
              }
              onUploadTemporaryImage={plusTemporaryImages}
              typeAppend={"files"}
              width="25%"
            />
          ) : (
            <></>
          )}
        </Stack>

        {!listImage.length ? (
          <DropzoneCustom
            maxFile={4}
            onUploadTemporaryImage={uploadTemporaryImages}
            typeAppend={"files"}
          />
        ) : (
          <></>
        )}
      </Stack>
    </div>
  );

  //==========================================================CHAINS//==========================================================
  // if (step === STEPS.CHAIN) {
  //   bodyContent = (
  //     <div className="flex flex-col gap-8">
  //       <Heading title="Add your step" />
  //       {fields.map((field, i) => {
  //         return (
  //           <Grid container key={field.id}>
  //             <Grid item xs={12} sx={{ mb: 1 }}>
  //               <Stack
  //                 direction="row"
  //                 gap={1}
  //                 justifyContent="space-between"
  //                 alignItems="center"
  //               >
  //                 <Typography variant="h4" fontWeight="500">{`Step ${
  //                   i + 1
  //                 }`}</Typography>
  //                 {field.id > 0 && (
  //                   <CustomButton
  //                     onClick={() => {
  //                       dispatch(
  //                         chainsActions.setTemporarylistStepImgUrl({
  //                           id: i,
  //                           data: [],
  //                         })
  //                       );
  //                       console.log({ formValues });
  //                       removeField(field.id);
  //                       unregister(`payload.${field.id}`);
  //                     }}
  //                     label="Remove"
  //                     color="error"
  //                     Icon={<DeleteIcon />}
  //                   />
  //                 )}
  //               </Stack>
  //             </Grid>
  //             <Grid item xs={12}>
  //               <Stack gap={1}>
  //                 <TextField
  //                   id="name"
  //                   label="Step name"
  //                   inputProps={{ ...register(`payload.${field.id}.name`) }}
  //                   error={
  //                     !!errors.payload &&
  //                     !!errors.payload[field.id] &&
  //                     !!errors.payload[field.id]?.name
  //                   }
  //                   required
  //                   helperText={
  //                     !!errors.payload &&
  //                     !!errors.payload[field.id] &&
  //                     !!errors.payload[field.id]?.name &&
  //                     errors.payload[field.id]?.name?.message
  //                   }
  //                   onChange={() => {
  //                     if (
  //                       !!errors.payload &&
  //                       !!errors.payload[field.id] &&
  //                       !!errors.payload[field.id]?.name
  //                     ) {
  //                       clearErrors(`payload.${field.id}.name`);
  //                     }
  //                   }}
  //                 />

  //                 <TextField
  //                   fullWidth
  //                   id="name"
  //                   label="Description"
  //                   inputProps={{
  //                     ...register(`payload.${field.id}.description`),
  //                   }}
  //                   error={
  //                     !!errors.payload &&
  //                     !!errors.payload[field.id] &&
  //                     !!errors.payload[field.id]?.description
  //                   }
  //                   required
  //                   helperText={
  //                     !!errors.payload &&
  //                     !!errors.payload[field.id] &&
  //                     !!errors.payload[field.id]?.description &&
  //                     errors.payload[field.id]?.description?.message
  //                   }
  //                   onChange={() => {
  //                     if (
  //                       !!errors.payload &&
  //                       !!errors.payload[field.id] &&
  //                       !!errors.payload[field.id]?.description
  //                     ) {
  //                       clearErrors(`payload.${field.id}.description`);
  //                     }
  //                   }}
  //                 />
  //                 <Stack
  //                   gap={1}
  //                   sx={{
  //                     border: `1px solid #ccc`,
  //                     p: 2,
  //                     borderRadius: 1,
  //                   }}
  //                 >
  //                   <b>{`Insert images*(Max:4)`}</b>
  //                   <Stack direction="row" gap={1}>
  //                     {listStepImage?.[i]?.length
  //                       ? listStepImage?.[i].map((img: any, i: number) => (
  //                           <ImageUpload
  //                             key={i}
  //                             width="25%"
  //                             src={img.preview}
  //                             onDelete={() => {
  //                               deleteImageUpload(img);
  //                             }}
  //                           />
  //                         ))
  //                       : null}
  //                     {!!listStepImage?.[i]?.length &&
  //                     countTotalElements(listStepImage?.[i]) < 4 ? (
  //                       <DropzoneCustom
  //                         id={i}
  //                         Icon={AddCircleOutlineIcon}
  //                         maxFile={
  //                           4 - countTotalElements(listStepImage?.[i]) > 1
  //                             ? 4 - countTotalElements(listStepImage?.[i])
  //                             : 1
  //                         }
  //                         onUploadTemporaryImage={plusTemporaryStepImages}
  //                         typeAppend={"files"}
  //                         width="25%"
  //                       />
  //                     ) : (
  //                       <></>
  //                     )}
  //                   </Stack>

  //                   {!listStepImage?.[i]?.length ? (
  //                     <DropzoneCustom
  //                       id={i}
  //                       maxFile={4}
  //                       onUploadTemporaryImage={uploadTemporaryStepImages}
  //                       typeAppend={"files"}
  //                     />
  //                   ) : (
  //                     <></>
  //                   )}
  //                 </Stack>
  //               </Stack>
  //             </Grid>
  //             {/* {field.id > 0 && (
  //               <Grid item xs={1} sx={{ p: 1 }} alignSelf="center">
  //                 <CustomButton
  //                   onClick={() => {
  //                     console.log({ formValues });
  //                     removeField(field.id);
  //                     unregister(`payload.${field.id}`);
  //                   }}
  //                   label=""
  //                   color="error"
  //                   Icon={<DeleteIcon />}
  //                 />
  //               </Grid>
  //             )} */}
  //           </Grid>
  //         );
  //       })}
  //       <CustomButton
  //         width="180px"
  //         onClick={addField}
  //         label="ADD A NEW STEP"
  //         color="primary"
  //         Icon={<AddIcon />}
  //       />
  //     </div>
  //   );
  // }

  //==========================================================REVIEW//==========================================================
  // if (step == STEPS.REVIEW) {
  //   bodyContent = (
  //     <div className="flex flex-col gap-2">
  //       <Heading title="Review your chains" />
  //       <Stack>
  //         <Typography variant="h4">{formValues.name}</Typography>
  //         <Typography variant="h5" sx={{ color: "#595959" }}>
  //           {formValues.description}
  //         </Typography>
  //       </Stack>

  //       {formValues.payload.map((data, i) => (
  //         <Stack key={i}>
  //           <Typography variant="h5" fontWeight={500}>
  //             step {i + 1} : {data.name}
  //           </Typography>
  //           <Typography sx={{ color: "#595959" }}>
  //             description: {data.description}
  //           </Typography>
  //         </Stack>
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <BaseModal
      disabled={loadingCreateChains}
      isOpen={isOpenModal}
      title="Tạo công đoạn mới"
      // actionLabel={step !== STEPS.REVIEW ? "Next" : "Create"}
      actionLabel="Tạo"
      // secondaryActionLabel={step == STEPS.DESCRIPTION ? "Cancel" : "Back"}
      onClose={onCloseModal}
      // secondaryAction={onSecondaryAction}
      onSubmit={() => {
        handleSubmit(onSubmitOrNext)();
      }}
      body={bodyContent}
    />
  );
};

export default CreateChainsModal;
