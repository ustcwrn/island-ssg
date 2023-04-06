import { unified } from 'unified';
import { describe, test, expect } from 'vitest';
// 解析md的语法为AST
import remarkParse from 'remark-parse';
// 将md的AST解析为HTML的AST
import remarkRehype from 'remark-rehype';
// 将HTML的AST进行序列化，转化为HTML的字符串
import rehypeStringify from 'rehype-stringify';
import { rehypePluginPreWrapper } from 'node/plugin-mdx/rehypePlugins/preWrapper';

describe('Markdown compile cases', () => {
  // 初始化 processor，链式调用，注册插件
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify);

  test('Compile title', async () => {
    const mdContent = '# 123';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot('"<h1>123</h1>"');
  });

  test('Compile code', async () => {
    const mdContent = 'I am using `Island.js`';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(
      '"<p>I am using <code>Island.js</code></p>"'
    );
  });
  // 测试 rehypePluginPreWrapper 插件
  test('Compile code block', async () => {
    const mdContent = '```js\nconsole.log(123);\n```';
    const result = processor.processSync(mdContent);
    expect(
      '<div class="language-js"><span class="lang">js</span><pre><code class="language-js">console.log(123)</code></pre></div>'
    ).toMatchInlineSnapshot(
      '"<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre><code class=\\"language-js\\">console.log(123)</code></pre></div>"'
    );
  });
});
