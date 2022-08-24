import React from 'react'
import { Form, Field, useForm, ControlledField, IsPathEqual } from './v3'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
}

const Input: React.FC<InputProps> = ({ value, onChange }) => {
  return (
    <input
      value={value}
      onChange={(e) => {
        onChange?.(e.target.value)
      }}
    />
  )
}

const V1Demo: React.FC = () => {
  const form = useForm()

  return (
    <Form
      form={form}
      initialValues={{
        input1: 'input1',
        nested: {
          input1: 'nested-input1',
        },
      }}
    >
      <div>
        <ControlledField name="input1">
          <Input />
        </ControlledField>
      </div>
      <div>
        <Field
          name="input2"
          dependencies={['input1']}
          onDependenciesChange={async (changes, value) => {
            return changes[0].value + '111'
          }}
        >
          <input />
        </Field>
      </div>
      <div>
        <Field name={['nested', 'input1']}>
          <input />
        </Field>
      </div>
      <div>
        <Field name={['nested', 'input2']}>
          <input />
        </Field>
      </div>
      <div>
        <button
          onClick={() =>
            console.log(form.getFields([['nested'], ['nested', 'input2']]))
          }
        >
          get fields value
        </button>
      </div>
    </Form>
  )
}

export default V1Demo
