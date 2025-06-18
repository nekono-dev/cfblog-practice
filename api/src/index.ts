import { Hono } from 'hono';
import imageUpload from './routes/imageUpload';
import postUpload from './routes/postUpload';
import getPage from './routes/getPage';
import createUser from './routes/createUser';
import authUser from './routes/authUser';
import getProfile from './routes/getProfile';
import getImage from './routes/getImage';

const app = new Hono();
app.route('/upload/image', imageUpload);
app.route('/upload/post', postUpload);
app.route('/', getPage);
app.route('/signup', createUser);
app.route('/user/login', authUser);
app.route('/user/profile', getProfile);
// app.route('/image', getImage); // 画像取得エンドポイント

export default app;
