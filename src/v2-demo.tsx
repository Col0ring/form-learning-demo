import React, { useState, memo } from 'react'
import { Form, Field, Store, useWatch, useForm, IsPathEqual } from './v2'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
}

const Input: React.FC<InputProps> = ({ value, onChange }) => {
  console.log(123)
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
      onFieldsChange={({ changedFields }) => {
        const input1Field = changedFields.find((changedField) =>
          IsPathEqual(changedField.name, ['input1'])
        )
        input1Field &&
          form.setFields([
            {
              name: ['input2'],
              value: input1Field.value + '_input2',
            },
          ])
      }}
    >
      <div>
        <Field name="input1">
          <Input />
        </Field>
      </div>
      <div>
        <Field
          name="input2"
          dependencies={['input1']}
          onDependenciesChange={(changes, value) => {
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
