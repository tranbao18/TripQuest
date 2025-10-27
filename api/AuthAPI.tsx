import axios from 'axios';
import { Alert } from 'react-native';

export const LoginUser = async (username: string, password: string) => {
    try {
        const res = await axios.get('https://travel-api-53hr.onrender.com/Users');
        const users = res.data;

        // Tìm user theo email/username
        const foundUser = users.find(
            (u: any) =>
                (u.email === username || u.name === username) &&
                u.password_hash === password
        );

        if (foundUser) {
            // giả lập token
            const fakeToken = "token_" + foundUser.id;
            return { user: foundUser, token: fakeToken };
        } else {
            throw new Error("Sai tài khoản hoặc mật khẩu");
        }
    } catch (error: any) {
        console.error(' API error:', error?.response?.data || error.message);
        return null;
    }
};

export const RegisterUser = async (userData: {
    name: string;
    email: string;
    password_hash: string;
}) => {
    try {
        const res = await axios.post('https://travel-api-53hr.onrender.com/Users', userData);
        return res.data;
    } catch (error: any) {
        console.error(' Lỗi đăng ký', error?.response?.data?.message || 'Không thể đăng ký tài khoản!');
        return null;
    }
};

export const ForgotPassword = async (email: string) => {
    try {
        // Lấy user từ JSON server hiện tại
        const res = await axios.get("https://travel-api-53hr.onrender.com/Users");
        const users = res.data;
        const user = users.find((u: any) => u.email === email);
        if (!user) return false;

        const newPassword = Math.random().toString(36).slice(-8);

        // Update password trong DB
        await axios.patch(`https://travel-api-53hr.onrender.com/Users/${user.id}`, {
            password_hash: newPassword
        });

        // Gọi backend Render để gửi email
        await axios.post(
            "https://movies-reviews-backend-uxlx.onrender.com/api/auth/send-email",
            {
                to: email,
                subject: "Mật khẩu mới",
                text: `Mật khẩu mới của bạn là: ${newPassword}`
            }
        );

        return true;

    } catch (error: any) {
        console.error(error);
        return false;
    }
};

export const UpdateUser = async (
    userId: string,
    updateData: {
        name?: string;
        email?: string;
        password_hash?: string;
        avatar?: string;
        phone?: string;
        location?: string;
        age?: number;
        gender?: string;
    }
) => {
    try {
        const res = await axios.patch(`https://travel-api-53hr.onrender.com/Users/${userId}`, updateData);
        return res.data;
    } catch (error: any) {
        console.error(
            'Lỗi cập nhật user:',
            error?.response?.data?.message || 'Không thể cập nhật tài khoản!'
        );
        return null;
    }
};


export const GetTours = async () => {
    try {
        const res = await axios.get('https://travel-api-53hr.onrender.com/Tours');
        return res.data;

    } catch (error: any) {
        console.error('Lỗi tải sản phẩm', error?.response?.data?.message || 'Không thể lấy danh sách sản phẩm!');
        return [];
    }
};

export const GetFavoritesTours = async (userId: number) => {
    try {
        const res = await axios.get("https://travel-api-53hr.onrender.com/Favorites");
        const favorites = res.data;

        // Tìm record của user trong Favorites
        const userFav = favorites.find((f: any) => f.user_id === userId);

        if (!userFav) return [];

        // Đảm bảo tour_id luôn là array
        const favTourIds = Array.isArray(userFav.tour_id) ? userFav.tour_id : [userFav.tour_id];

        // Lấy chi tiết tour theo danh sách id
        const tourRes = await axios.get("https://travel-api-53hr.onrender.com/Tours");
        const tours = tourRes.data.tours || tourRes.data;

        // Lọc những tour user yêu thích
        return tours.filter((t: any) => favTourIds.includes(t.id));
    } catch (error: any) {
        console.error("Lỗi lấy tour yêu thích:", error?.response?.data || error.message);
        return [];
    }
};

// Toggle Favorite (add/remove khi click icon tym)
export const ToggleFavorite = async (userId: number, tourId: string) => {
    try {
        const res = await axios.get("https://travel-api-53hr.onrender.com/Favorites");
        const favorites = res.data;

        // Kiểm tra user đã có record trong Favorites chưa
        let userFav = favorites.find((f: any) => f.user_id === userId);

        if (!userFav) {
            // Nếu chưa có thì tạo mới
            const newFav = {
                user_id: userId,
                tour_id: [tourId],
            };
            const createRes = await axios.post("https://travel-api-53hr.onrender.com/Favorites",newFav);
            return createRes.data;
        } else {
            // Normalize về array
            let favTourIds = Array.isArray(userFav.tour_id) ? [...userFav.tour_id] : [userFav.tour_id];

            if (favTourIds.includes(tourId)) {
                // Nếu đã có thì remove
                favTourIds = favTourIds.filter((id) => id !== tourId);
            } else {
                // Nếu chưa có thì add
                favTourIds.push(tourId);
            }

            // Update API
            const updateRes = await axios.patch(`https://travel-api-53hr.onrender.com/Favorites/${userFav.id}`,{ tour_id: favTourIds } );

            return updateRes.data;
        }
    } catch (error: any) {
        console.error("Lỗi toggle favorite:", error?.response?.data || error.message);
        return null;
    }
};