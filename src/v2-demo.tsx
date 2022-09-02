import React from 'react'
import { Form, Field, useForm, useWatch } from './v2'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
}

const Input: React.FC<InputProps> = ({ value, onChange }) => {
  console.log('v2 input changed')
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

const V2Demo: React.FC = () => {
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
        <Field name="input2">
          <input />
        </Field>
      </div>
      <div>
        <Field name="input3">
          <input />
        </Field>
      </div>
      <div>
        <button
          onClick={() =>
            console.log(
              'v2',
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

export default V2Demo
