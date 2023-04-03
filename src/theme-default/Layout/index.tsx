import React, { useState } from 'react';

// 这是一个包含脚本和交互按钮的简单组件，
export function Layout() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>This is Layout component 125</h1>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>Add Count</button>
      </div>
    </div>
  );
}
