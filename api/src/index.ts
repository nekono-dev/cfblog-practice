import { Hono } from 'hono';
import imageUpload from './routes/image/put';
import postUpload from './routes/page/post';
import getPage from './routes/page/get';
import createUser from './routes/user/post';
import authUser from './routes/user/token/post';
import getProfile from './routes/getProfile';
import getImage from './routes/image/get';

const app = new Hono();
app.route('/post', postUpload);
app.route('/post', getPage);
app.route('/user', createUser);
app.route('/user', getProfile);
app.route('/user/token', authUser);
app.route('/image', imageUpload);
// app.route('/image', getImage); // 画像取得エンドポイント

export default app;
