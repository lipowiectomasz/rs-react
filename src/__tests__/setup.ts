import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import {
  TextEncoder as NodeTextEncoder,
  TextDecoder as NodeTextDecoder,
} from 'util';

global.TextEncoder = NodeTextEncoder as typeof TextEncoder;
global.TextDecoder = NodeTextDecoder as typeof TextDecoder;
