import { Router, Request, Response } from "express";
import { ProductModel } from '../model/product';
import { ProductErrors, UserErrors } from "../common/errors";
import { UserModel } from "../model/user";
import { protect } from "../middlewares/auth";
const router = Router();

router.get('/', async (_, res) => {
    try {
        const products = await ProductModel.find({});
        res.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post("/checkout", protect, async (req: Request, res: Response) => {
    const { customerID, cartItems } = req.body;

    try {
        const user = await UserModel.findById(customerID);

        const productIDs = Object.keys(cartItems);
        const products = await ProductModel.find({ _id: { $in: productIDs } });

        if (!user) {
            return res.status(400).json({ type: ProductErrors.NO_USERS_FOUND });
        }
        if (products.length !== productIDs.length) {
            return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
        }

        let totalPrice = 0;
        for (const item in cartItems) {
            const product = products.find((product) => String(product._id) === item);
            if (!product) {
                return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
            }

            if (product.stockQuantity < cartItems[item]) {
                return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
            }

            totalPrice += product.price * cartItems[item];
        }

        if (user.availableMoney < totalPrice) {
            return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY });
        }

        user.availableMoney -= totalPrice;
        user.purchasedItems.push(...productIDs);

        await user.save();
        await ProductModel.updateMany(
            { _id: { $in: productIDs } },
            { $inc: { stockQuantity: -1 } }
        );
        res.json({ purchasedItems: user.purchasedItems });
    } catch (error) {
        console.log(error);
    }
});

router.get('/available-money/:userID', protect, async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await UserModel.findById(userID);
        if (!user) {
            res.status(400).json({ type: UserErrors.NO_USER_FOUND })
        }
        res.json({ availableMoney: user.availableMoney })
    }
    catch (err) {
        res.status(500).json({ type: err });
    }
})

export { router as productRouter };