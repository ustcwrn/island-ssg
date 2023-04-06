import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // <pre><code class="language-js">console.log(123)</code></pre>
      // 1. 找到 pre 元素
      // 2. 解析出代码的语言名称
      // 3. 变换 Html AST
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code' &&
        !node.data?.isVisited
      ) {
        // 找到了pre元素,开始解析语法名称
        const codeNode = node.children[0];
        const codeClassName = codeNode.properties?.className?.toString() || '';
        // language-xxx
        const lang = codeClassName.split('-')[1];
        // 操作 AST，完成 HTML 结构的变换
        const cloneNode: Element = {
          type: 'element',
          tagName: 'pre',
          children: node.children,
          data: {
            isVisited: true
          }
        };
        // 修改原来的 pre 标签 -> div 标签
        node.tagName = 'div';
        node.properties = node.properties || {};
        node.properties.className = codeClassName;
        // // 构造 div 标签的子元素
        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: lang
            },
            children: [
              {
                type: 'text',
                value: 'lang'
              }
            ]
          },
          cloneNode
        ];
      }
    });
  };
};
