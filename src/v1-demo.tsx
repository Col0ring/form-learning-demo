import React, { useState, memo } from 'react'
import { Form, Field, Store, useForm, useWatch } from './v1'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
}

const Input: React.FC<InputProps> = ({ value, onChange }) => {
  console.log('v1 input changed')
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

const MemoInput = memo(Input)

const V1Demo: React.FC = () => {
  const form = useForm()
  const [fields, setFields] = useState<Store>({
    input1: 'input1',
    input2: 'input2',
    input3: 'input3',
  })

  return (
    <Form
      form={form}
      initialValues={fields}
      onFieldsChange={({ fieldsStore, changedFields }) => {
        const input1Field = changedFields.find(
          (changedField) => changedField.name === 'input1'
        )
        input1Field &&
          form.setFields([
            {
              name: 'input2',
              value: input1Field.value + '_input2',
            },
          ])
        setFields(fieldsStore)
      }}
    >
      <div>
        <Field name="input1">
          <MemoInput />
        </Field>
        {/* <Field name="input1">
          <Input />
        </Field> */}
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
              'v1',
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

export default V1Demo
