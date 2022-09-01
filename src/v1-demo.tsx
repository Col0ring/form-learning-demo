import React, { useState, memo } from 'react'
import { Form, Field, Store, useForm, IsPathEqual } from './v1'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
}

const Input: React.FC<InputProps> = ({ value, onChange }) => {
  // console.log(useWatch())
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
    nested: {
      input1: 'nested-input1',
    },
  })

  return (
    <Form
      form={form}
      initialValues={fields}
      onFieldsChange={({ fieldsStore, changedFields }) => {
        const input1Field = changedFields.find((changedField) =>
          IsPathEqual(changedField.name, ['input1'])
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
      </div>
      <div>
        <Field
          name="input2"
          dependencies={['input1']}
          onDependenciesChange={(changes, value) => {
            console.log(changes)
            return value
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
