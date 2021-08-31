import * as React from 'react';
import type { FC } from 'react';

interface PersonProps {
  name?: string;
 }

/**
* Person组件
* @description 这是关于人物组件的描述内容
* @extends {Component}
*/
export const Person: FC<PersonProps> = ({name}) => {

  return (
    <div>name-{name}</div>
  );
}

Person.defaultProps = {
  name: 'default'
}
