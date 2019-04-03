import {Source} from 'tallbag';
import {Metadata} from 'shadow-callbag';

export default function forEach<T>(
  operation: (data: T) => void,
): (source: Source<T, Metadata>) => void;
