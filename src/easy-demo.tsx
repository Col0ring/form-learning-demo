import React, { useState } from 'react'

interface ChildProps {
  value: string
  onChange: (input: string) => void
}

const Child: React.FC<ChildProps> = ({ value, onChange }) => {
  return (
    <div>
      <h3>{value}</h3>
      <input
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    </div>
  )
}

const Parent: React.FC = () => {
  const [state, setState] = useState(() => ({
    input1: '',
    input2: '',
  }))
  const onChange = (input: string, key: string) => {
    setState((prevState) => ({
      ...prevState,
      [key]: input,
    }))
  }

  return (
    <div>
      <div>
        <h2>Input1</h2>
        <Child value={state.input1} onChange={(v) => onChange(v, 'input1')} />
      </div>
      <div>
        <h2>Input2</h2>
        <Child value={state.input2} onChange={(v) => onChange(v, 'input2')} />
      </div>
    </div>
  )
}

const EasyDemo: React.FC = () => {
  return <Parent />
}

export default EasyDemo
