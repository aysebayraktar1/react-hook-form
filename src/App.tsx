import * as React from "react";
import {
  useForm,
  FormProvider,
  Controller,
  ControllerProps,
  useFormContext,
} from "react-hook-form";
import './App.css'
type FormValues = {
  firstName: string;
};

type Props = Omit<ControllerProps<"input">, "render"> & {
  render: (args: {
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    value: any;
    name: string;
    isTouched: boolean;
    isDirty: boolean;
    warning: string | boolean;
  }) => React.ReactElement;
  warn: (value: string) => boolean | string;
};

const PowerController = (props: Props) => {
  const { formState } = useFormContext();
  const isDirty = !!formState.dirtyFields[props.name];
  const isTouched = !!formState.touched[props.name];
  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={props.defaultValue}
      render={(innerProps) => {
        return props.render({
          ...innerProps,
          isDirty,
          isTouched,
          warning: props.warn(innerProps.value),
        });
      }}
    />
  );
};

const  App = () => {
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;
  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <div className="App">
      <header className="App-header">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PowerController
              control={methods.control}
              name="firstName"
              defaultValue=""
              warn={(value: string) => value.length > 10 && "This is too long."}
              render={({
                value,
                onChange,
                onBlur,
                name,
                isDirty,
                isTouched,
                warning,
              }) => {
                return (
                  <>
                    <input {...{ value, onChange, onBlur, name }} />
                    {isDirty && <p>This form is Dirty</p>}
                    {isTouched && <p>This form is isTouched</p>}
                    {warning}
                  </>
                );
              }}
            />
            <input type="submit" />
          </form>
        </FormProvider>
      </header>
    </div>
  );
}
export default App
