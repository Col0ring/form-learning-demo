import React, { useState } from 'react'
import { Form, Field, Store, useForm } from './v1'

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
      onFieldsChange={({ fieldsStore }) => {
        setFields(fieldsStore)
      }}
    >
      <div>
        <Field name="input1">
          <input />
        </Field>
      </div>
      <div>
        <Field name="input2">
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
          onClick={() => console.log(form.getFields([['nested', 'input2']]))}
        >
          get fields value
        </button>
      </div>
    </Form>
  )
}

export default V1Demo
