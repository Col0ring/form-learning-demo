import React from 'react'
import { Form, Field, useForm, NativeField, useWatch } from './v3'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
}

const Input: React.FC<InputProps> = ({ value, onChange }) => {
  console.log('v3 input changed')
  const input3 = useWatch('input3')
  console.log(input3)
  return (
    <input
      value={value}
      onChange={(e) => {
        onChange?.(e.target.value)
      }}
    />
  )
}

const V3Demo: React.FC = () => {
  const form = useForm()

  return (
    <Form
      form={form}
      initialValues={{
        input1: 'input1',
        input2: 'input2',
        input3: 'input3',
      }}
    >
      <div>
        <Field name="input1">
          <Input />
        </Field>
      </div>
      <div>
        <NativeField name="input2">
          <input />
        </NativeField>
      </div>
      <div>
        <NativeField name="input3">
          <input />
        </NativeField>
      </div>
      <div>
        <button
          onClick={() =>
            console.log(
              'v3',
              form.getFields(['input1', 'input2']),
              form.getFields()
            )
          }
        >
          get fields value
        </button>
      </div>
    </Form>
  )
}

export default V3Demo
