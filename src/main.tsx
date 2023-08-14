import { render } from 'preact';
import Home from './pages/Home';
import './index.css';

render(<Home />, document.getElementById('app') as HTMLElement);
