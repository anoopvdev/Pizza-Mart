-- MySQL dump 10.13  Distrib 26.10.0, for Win64 (x86_64)
--
-- Host: localhost    Database: pizzamart
-- ------------------------------------------------------
-- Server version	26.10.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (2,'Anoop.V Anoop. V','9778559408','Dotspace Business Park','Kazhakkoottam','Kerala','695582',1,'2026-11-11 09:12:08.637270','2026-11-11 09:12:08.637324',7),(3,'Anoop.V Anoop. V','8606012603','Dotspace Business Park','Kazhakkoottam','Kerala','695582',1,'2026-11-12 09:52:29.267845','2026-11-12 09:52:29.267865',5);
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_banner`
--

LOCK TABLES `user_banner` WRITE;
/*!40000 ALTER TABLE `user_banner` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_cart`
--

LOCK TABLES `user_cart` WRITE;
/*!40000 ALTER TABLE `user_cart` DISABLE KEYS */;
INSERT INTO `user_cart` VALUES (3,'2026-11-03 15:04:08.825443','2026-11-03 15:04:08.825473',7,NULL),(4,'2026-11-04 14:38:14.980898','2026-11-04 14:38:14.980936',11,NULL),(5,'2026-11-10 10:30:15.512805','2026-11-10 10:30:15.512838',12,NULL),(6,'2026-11-12 09:52:12.004185','2026-11-12 09:52:12.004212',5,NULL);
/*!40000 ALTER TABLE `user_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_cartitems`
--

LOCK TABLES `user_cartitems` WRITE;
/*!40000 ALTER TABLE `user_cartitems` DISABLE KEYS */;
INSERT INTO `user_cartitems` VALUES (48,1,'2026-11-12 11:16:44.370439',4,11,3);
/*!40000 ALTER TABLE `user_cartitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_category`
--

LOCK TABLES `user_category` WRITE;
/*!40000 ALTER TABLE `user_category` DISABLE KEYS */;
INSERT INTO `user_category` VALUES (2,'Non-veg','A non-vegetarian pizza features a base of dough, tomato or specialized sauce, and melted mozzarella cheese, topped with a variety of meats or poultry such as chicken, lamb, or seafood.','categories/BBQ_Chicken_Pizza_non-veg.jpg',1,'2026-11-07 14:29:12.067133'),(3,'Veg','vegetarian pizza is a pizza made without any meat, poultry, or seafood. Instead, it uses a dough crust, a tomato or herb sauce, melted cheese (such as mozzarella), and a generous variety of vegetables or plant-based toppings.','categories/Veggie_Supreme.jpg',1,'2026-11-09 05:46:02.802387');
/*!40000 ALTER TABLE `user_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_contactmessage`
--

LOCK TABLES `user_contactmessage` WRITE;
/*!40000 ALTER TABLE `user_contactmessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_contactmessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_coupon`
--

LOCK TABLES `user_coupon` WRITE;
/*!40000 ALTER TABLE `user_coupon` DISABLE KEYS */;
INSERT INTO `user_coupon` VALUES (1,'PIZZA20','percentage',20.00,300.00,100,0,'2026-11-06 14:50:00.000000','2026-11-06 14:51:00.000000',1,'2026-11-06 05:25:32.609796',200.04);
/*!40000 ALTER TABLE `user_coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_emailotp`
--

LOCK TABLES `user_emailotp` WRITE;
/*!40000 ALTER TABLE `user_emailotp` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_emailotp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_order`
--

LOCK TABLES `user_order` WRITE;
/*!40000 ALTER TABLE `user_order` DISABLE KEYS */;
INSERT INTO `user_order` VALUES (4,870.00,0.00,0.00,870.00,'pending','pending','2026-11-10 05:08:53.643612','2026-11-10 05:08:53.643644',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PM3A9BC0FF21','razorpay',NULL),(5,870.00,0.00,0.00,870.00,'pending','pending','2026-11-10 05:09:00.922608','2026-11-10 05:09:00.922653',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PMFB46FA153B','razorpay',NULL),(6,870.00,0.00,0.00,870.00,'pending','pending','2026-11-10 05:13:50.169389','2026-11-10 05:13:50.169418',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PM46E5BA177B','razorpay',NULL),(7,870.00,0.00,0.00,870.00,'pending','pending','2026-11-10 05:14:34.983578','2026-11-10 05:14:34.983606',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PM3E353A7499','razorpay',NULL),(11,870.00,0.00,0.00,870.00,'confirmed','pending','2026-11-10 05:53:11.473223','2026-11-10 05:53:11.473255',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PM6D1367820F','cod',NULL),(12,300.00,0.00,0.00,300.00,'pending','pending','2026-11-10 05:53:38.652730','2026-11-10 05:53:38.652753',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PM89096AE09A','razorpay','order_TyMdD92vieqWod'),(13,300.00,0.00,0.00,300.00,'pending','pending','2026-11-10 05:54:11.803250','2026-11-10 05:54:11.803270',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PM7BC7008588','razorpay','order_TyMdnJmwUrqFR5'),(14,300.00,0.00,0.00,300.00,'confirmed','pending','2026-11-10 05:54:25.741069','2026-11-10 05:54:25.741102',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PME88DACFFFB','cod',NULL),(15,300.00,0.00,0.00,300.00,'pending','pending','2026-11-10 07:30:18.270870','2026-11-10 07:30:18.270906',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PM654B09EA9A','razorpay','order_TyOHJSo3o3l8QU'),(16,300.00,0.00,0.00,300.00,'pending','pending','2026-11-10 07:32:25.745365','2026-11-10 07:32:25.745390',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PM503712CF6C','razorpay','order_TyOJYcPQVDTKst'),(17,300.00,0.00,0.00,300.00,'confirmed','pending','2026-11-10 07:32:44.003441','2026-11-10 07:32:44.003469',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PM57C220A5E5','cod',NULL),(18,270.00,0.00,0.00,270.00,'confirmed','pending','2026-11-10 07:47:18.190468','2026-11-10 07:47:18.190494',NULL,11,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9876543210','695582','Kerala','PM035E593FD5','cod',NULL),(19,270.00,0.00,0.00,270.00,'pending','pending','2026-11-10 08:18:29.185940','2026-11-10 08:18:29.185975',NULL,7,'Dotspace Business Park','Kazhakkoottam','vimal','9775889408','695582','Kerala','PMD65B5DA579','razorpay','order_TyP6CzBTvevkJI'),(20,270.00,0.00,0.00,270.00,'pending','pending','2026-11-10 08:18:52.171938','2026-11-10 08:18:52.171968',NULL,7,'Dotspace Business Park','Kazhakkoottam','vimal','9775889408','695582','Kerala','PM197D541DB5','razorpay','order_TyP6byGvDY5HLA'),(21,270.00,0.00,0.00,270.00,'confirmed','pending','2026-11-10 08:18:59.746475','2026-11-10 08:18:59.746497',NULL,7,'Dotspace Business Park','Kazhakkoottam','vimal','9775889408','695582','Kerala','PMCBB1BC5AEC','cod',NULL),(22,300.00,0.00,0.00,300.00,'pending','pending','2026-11-10 10:31:37.194022','2026-11-10 10:31:37.194052',NULL,12,'DotSpace PVT limited','trivandrum','NewUser','7845125689','695509','kerala','PMC0AF650DB8','razorpay','order_TyRMq0YB5M8QWP'),(23,300.00,0.00,0.00,300.00,'confirmed','pending','2026-11-10 10:31:50.331252','2026-11-10 10:31:50.331286',NULL,12,'DotSpace PVT limited','trivandrum','NewUser','7845125689','695509','kerala','PMCBB166E229','cod',NULL),(24,540.00,0.00,0.00,540.00,'confirmed','pending','2026-11-10 10:41:30.867797','2026-11-10 10:41:30.867828',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V','9778559408','695582','Kerala','PM1485B09757','cod',NULL),(25,300.00,0.00,0.00,300.00,'pending','pending','2026-11-10 10:42:04.256154','2026-11-10 10:42:04.256183',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9876543210','695582','Kerala','PM2C7098944B','razorpay','order_TyRXsTMSXPlqDA'),(26,600.00,0.00,0.00,600.00,'pending','pending','2026-11-11 09:23:57.222867','2026-11-11 09:23:57.222890',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PM55D6D60B2A','razorpay','order_TyokUE0v1DUBGD'),(27,600.00,0.00,0.00,600.00,'confirmed','pending','2026-11-11 09:24:06.893430','2026-11-11 09:24:06.893453',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PMCC63D67A2E','cod',NULL),(28,300.00,0.00,0.00,300.00,'pending','pending','2026-11-11 09:24:27.951419','2026-11-11 09:24:27.951442',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PM5C24894FA7','razorpay','order_Tyol1fYpANooGc'),(29,300.00,0.00,0.00,300.00,'pending','pending','2026-11-11 09:24:50.814949','2026-11-11 09:24:50.814971',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PM7FC65BDF5D','razorpay','order_TyolQdWhGNOjIB'),(30,300.00,0.00,0.00,300.00,'out_for_delivery','pending','2026-11-11 09:25:33.825689','2026-11-11 09:25:33.825722',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PM3E17A715F0','razorpay','order_TyomBZiigt9gcL'),(31,300.00,0.00,0.00,300.00,'pending','pending','2026-11-11 09:25:58.946082','2026-11-11 09:25:58.946107',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PM31C335FC98','razorpay','order_Tyomd6Lx3qt1PT'),(32,300.00,0.00,0.00,300.00,'cancelled','pending','2026-11-11 09:32:54.932136','2026-11-11 09:32:54.932168',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PM3A8C38C29F','razorpay','order_Tyotx3QT4kuwRb'),(33,600.00,0.00,0.00,600.00,'confirmed','pending','2026-11-11 09:38:50.956936','2026-11-11 09:38:50.956960',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PMFD765919EE','razorpay','order_Typ0Dqizjio1xD'),(34,600.00,0.00,0.00,600.00,'confirmed','pending','2026-11-11 09:39:29.231239','2026-11-11 09:39:29.231263',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PM5D1F8A2D04','cod',NULL),(35,290.00,0.00,0.00,290.00,'pending','pending','2026-11-11 13:08:31.287067','2026-11-11 13:08:31.287114',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PMF02FB2AF0B','razorpay','order_TysZharQpvc2cL'),(36,290.00,0.00,0.00,290.00,'cancelled','pending','2026-11-12 08:19:09.592130','2026-11-12 08:19:09.592150',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PM8D06730B9D','razorpay','order_TzCBAvFPh2mcY4'),(37,290.00,0.00,0.00,290.00,'delivered','pending','2026-11-12 08:19:16.473115','2026-11-12 08:19:16.473134',NULL,7,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','9778559408','695582','Kerala','PM0CC53B4EA3','cod',NULL),(38,300.00,0.00,0.00,300.00,'confirmed','pending','2026-11-12 09:52:35.749462','2026-11-12 09:52:35.749490',NULL,5,'Dotspace Business Park','Kazhakkoottam','Anoop.V Anoop. V','8606012603','695582','Kerala','PMF0D1711389','cod',NULL);
/*!40000 ALTER TABLE `user_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_orderitems`
--

LOCK TABLES `user_orderitems` WRITE;
/*!40000 ALTER TABLE `user_orderitems` DISABLE KEYS */;
INSERT INTO `user_orderitems` VALUES (1,'Pepperoni Pizza',270.00,1,270.00,4,18),(2,'Sausage Pizza',300.00,1,300.00,4,19),(3,'Seafood Pizza',300.00,1,300.00,4,20),(4,'Pepperoni Pizza',270.00,1,270.00,5,18),(5,'Sausage Pizza',300.00,1,300.00,5,19),(6,'Seafood Pizza',300.00,1,300.00,5,20),(7,'Pepperoni Pizza',270.00,1,270.00,6,18),(8,'Sausage Pizza',300.00,1,300.00,6,19),(9,'Seafood Pizza',300.00,1,300.00,6,20),(10,'Pepperoni Pizza',270.00,1,270.00,7,18),(11,'Sausage Pizza',300.00,1,300.00,7,19),(12,'Seafood Pizza',300.00,1,300.00,7,20),(22,'Pepperoni Pizza',270.00,1,270.00,11,18),(23,'Sausage Pizza',300.00,1,300.00,11,19),(24,'Seafood Pizza',300.00,1,300.00,11,20),(25,'Sausage Pizza',300.00,1,300.00,12,19),(26,'Sausage Pizza',300.00,1,300.00,13,19),(27,'Sausage Pizza',300.00,1,300.00,14,19),(28,'Seafood Pizza',300.00,1,300.00,15,20),(29,'Seafood Pizza',300.00,1,300.00,16,20),(30,'Seafood Pizza',300.00,1,300.00,17,20),(31,'Pepperoni Pizza',270.00,1,270.00,18,18),(32,'Pepperoni Pizza',270.00,1,270.00,19,18),(33,'Pepperoni Pizza',270.00,1,270.00,20,18),(34,'Pepperoni Pizza',270.00,1,270.00,21,18),(35,'Seafood Pizza',300.00,1,300.00,22,20),(36,'Seafood Pizza',300.00,1,300.00,23,20),(37,'Mediterranean Pizza',240.00,1,240.00,24,14),(38,'Seafood Pizza',300.00,1,300.00,24,20),(39,'Seafood Pizza',300.00,1,300.00,25,20),(40,'Seafood Pizza',300.00,2,600.00,26,20),(41,'Seafood Pizza',300.00,2,600.00,27,20),(42,'Spinach Alfredo Pizza',300.00,1,300.00,28,21),(43,'Spinach Alfredo Pizza',300.00,1,300.00,29,21),(44,'Spinach Alfredo Pizza',300.00,1,300.00,30,21),(45,'Spinach Alfredo Pizza',300.00,1,300.00,31,21),(46,'Spinach Alfredo Pizza',300.00,1,300.00,32,21),(47,'Seafood Pizza',300.00,1,300.00,33,20),(48,'Seafood Pizza',300.00,1,300.00,34,20),(49,'Veggie Supreme',290.00,1,290.00,35,3),(50,'Veggie Supreme',290.00,1,290.00,36,3),(51,'Veggie Supreme',290.00,1,290.00,37,3),(52,'Sausage Pizza',300.00,1,300.00,38,19);
/*!40000 ALTER TABLE `user_orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_passwordrestotp`
--

LOCK TABLES `user_passwordrestotp` WRITE;
/*!40000 ALTER TABLE `user_passwordrestotp` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_passwordrestotp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_payment`
--

LOCK TABLES `user_payment` WRITE;
/*!40000 ALTER TABLE `user_payment` DISABLE KEYS */;
INSERT INTO `user_payment` VALUES (1,'razorpay',NULL,870.00,'failed','2026-11-10 05:08:53.648641','2026-11-10 05:08:53.648665',4),(2,'razorpay',NULL,870.00,'failed','2026-11-10 05:09:00.927075','2026-11-10 05:09:00.927094',5),(3,'razorpay',NULL,870.00,'failed','2026-11-10 05:13:50.172967','2026-11-10 05:13:50.172986',6),(4,'razorpay',NULL,870.00,'failed','2026-11-10 05:14:34.988287','2026-11-10 05:14:34.988324',7),(8,'cod',NULL,870.00,'pending','2026-11-10 05:53:11.477362','2026-11-10 05:53:11.477388',11),(9,'razorpay',NULL,300.00,'pending','2026-11-10 05:53:38.654151','2026-11-10 05:53:38.654167',12),(10,'razorpay',NULL,300.00,'pending','2026-11-10 05:54:11.804615','2026-11-10 05:54:11.804631',13),(11,'cod',NULL,300.00,'pending','2026-11-10 05:54:25.745555','2026-11-10 05:54:25.745582',14),(12,'razorpay',NULL,300.00,'pending','2026-11-10 07:30:18.273686','2026-11-10 07:30:18.273718',15),(13,'razorpay',NULL,300.00,'pending','2026-11-10 07:32:25.747217','2026-11-10 07:32:25.747248',16),(14,'cod',NULL,300.00,'pending','2026-11-10 07:32:44.005433','2026-11-10 07:32:44.005457',17),(15,'cod',NULL,270.00,'pending','2026-11-10 07:47:18.191991','2026-11-10 07:47:18.192006',18),(16,'razorpay',NULL,270.00,'pending','2026-11-10 08:18:29.187904','2026-11-10 08:18:29.188191',19),(17,'razorpay',NULL,270.00,'pending','2026-11-10 08:18:52.173684','2026-11-10 08:18:52.173710',20),(18,'cod',NULL,270.00,'pending','2026-11-10 08:18:59.748397','2026-11-10 08:18:59.748417',21),(19,'razorpay',NULL,300.00,'pending','2026-11-10 10:31:37.197536','2026-11-10 10:31:37.197564',22),(20,'cod',NULL,300.00,'pending','2026-11-10 10:31:50.334570','2026-11-10 10:31:50.334601',23),(21,'cod',NULL,540.00,'pending','2026-11-10 10:41:30.869937','2026-11-10 10:41:30.869963',24),(22,'razorpay',NULL,300.00,'pending','2026-11-10 10:42:04.258340','2026-11-10 10:42:04.258371',25),(23,'razorpay',NULL,600.00,'pending','2026-11-11 09:23:57.233694','2026-11-11 09:23:57.233732',26),(24,'cod',NULL,600.00,'pending','2026-11-11 09:24:06.900840','2026-11-11 09:24:06.900865',27),(25,'razorpay',NULL,300.00,'pending','2026-11-11 09:24:27.953746','2026-11-11 09:24:27.953780',28),(26,'razorpay',NULL,300.00,'pending','2026-11-11 09:24:50.822677','2026-11-11 09:24:50.822711',29),(27,'razorpay',NULL,300.00,'pending','2026-11-11 09:25:33.831813','2026-11-11 09:25:33.831846',30),(28,'razorpay',NULL,300.00,'pending','2026-11-11 09:25:58.953731','2026-11-11 09:25:58.953766',31),(29,'razorpay',NULL,300.00,'pending','2026-11-11 09:32:54.935038','2026-11-11 09:32:54.935063',32),(30,'razorpay',NULL,600.00,'pending','2026-11-11 09:38:50.959876','2026-11-11 09:38:50.959896',33),(31,'cod',NULL,600.00,'pending','2026-11-11 09:39:29.236711','2026-11-11 09:39:29.236786',34),(32,'razorpay',NULL,290.00,'pending','2026-11-11 13:08:31.314480','2026-11-11 13:08:31.314515',35),(33,'razorpay',NULL,290.00,'pending','2026-11-12 08:19:09.600431','2026-11-12 08:19:09.600454',36),(34,'cod',NULL,290.00,'pending','2026-11-12 08:19:16.474874','2026-11-12 08:19:16.474899',37),(35,'cod',NULL,300.00,'pending','2026-11-12 09:52:35.756708','2026-11-12 09:52:35.756735',38);
/*!40000 ALTER TABLE `user_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_pizzas`
--

LOCK TABLES `user_pizzas` WRITE;
/*!40000 ALTER TABLE `user_pizzas` DISABLE KEYS */;
INSERT INTO `user_pizzas` VALUES (2,'BBQ Chicken Pizza','A BBQ chicken pizza is a non-traditional, American-style pizza that replaces the classic tomato-based red sauce with a smoky, sweet, and tangy barbecue sauce.','products/BBQ_Chicken_Pizza_non-veg.jpg',250.00,1,'2026-11-07 14:29:43.001907','2026-11-07 14:29:43.001935',2),(3,'Veggie Supreme','A Veggie Supreme is a loaded, garden-style vegetarian pizza featuring a combination of fresh vegetables, cheese, and tomato or pan sauce on a crust','products/Veggie_Supreme.jpg',290.00,1,'2026-11-09 05:46:51.397369','2026-11-09 05:46:51.397390',3),(4,'Supreme Pizza (with meat toppings)','A Supreme Pizza is a loaded \"everything\" style pie that combines multiple savory meats, crisp vegetables, cheese, and tomato sauce over a classic crust','products/Supreme_Pizza_with_meat_toppings_non-veg.jpg',200.00,1,'2026-11-09 05:48:16.248649','2026-11-09 05:48:16.248683',2),(5,'Buffalo Chicken Pizza','A Buffalo Chicken Pizza is a popular specialty pie that reimagines classic Buffalo-style chicken wings as a pizza topping.','products/Buffalo_Chicken_Pizza_non-veg.jpg',250.00,1,'2026-11-09 05:49:15.999045','2026-11-09 05:49:15.999072',2),(6,'Chicken Alfredo Pizza','Chicken Alfredo Pizza is a rich, white-sauce pie that swaps traditional tomato marinara for a creamy Alfredo Sauce Recipe on Tastes Better From Scratch.','products/Chicken_Alfredo_Pizza_non-veg.jpg',300.00,1,'2026-11-09 05:50:19.164228','2026-11-09 05:50:19.164254',2),(7,'Chicken Tikka','A chicken tikka pizza is a popular fusion dish that combines traditional Indian chicken tikka flavors with the classic structure of an Italian pizza.','products/Chicken_Tikka_Pizza_non-veg.jpg',260.00,1,'2026-11-09 05:51:20.143665','2026-11-09 05:51:20.143691',2),(8,'Corn & Cheese Pizza','Corn & Cheese Pizza is a popular vegetarian pizza featuring a golden, crispy or pan crust layered with tangy tomato-based pizza sauce, sweet corn kernels, and a generous blanket of melted mozzarella cheese.','products/Corn__Cheese_Pizza.jpg',310.00,1,'2026-11-09 05:52:20.794280','2026-11-09 05:52:20.794307',3),(9,'Farmhouse Pizza','farmhouse pizza is a rustic, hearty style of pizza loaded with fresh, farm-fresh or garden-style ingredients like crunchy vegetables, melted cheese, and aromatic herbs.','products/Farmhouse.jpg',230.00,1,'2026-11-09 05:55:40.951396','2026-11-09 05:55:40.951440',3),(10,'Four Cheese Pizza','A 4 cheese pizza (known in Italian as pizza quattro formaggi or pizza ai quattro formaggi) is a classic style of pizza topped with a combination of four distinct types of melted cheese.','products/Four_Cheese_Pizza.jpg',300.00,1,'2026-11-09 05:56:32.802170','2026-11-09 05:56:32.802198',3),(11,'Hawaiian Pizza','Hawaiian pizza is a traditional-style pie topped with tomato sauce, mozzarella cheese, ham (or bacon), and sweet pineapple chunks.','products/Hawaiian_Pizza_non-veg.jpg',280.00,1,'2026-11-09 05:57:25.332968','2026-11-09 05:57:25.332996',2),(12,'Margherita','Pizza Margherita is a classic Neapolitan pizza known for its simple ingredients and bright flavors representing the colors of the Italian flag.','products/Margherita.jpg',300.00,1,'2026-11-09 05:58:33.276659','2026-11-09 05:58:33.276688',3),(13,'Meat Lovers Pizza','Meat Lovers Pizza is a hearty, protein-packed pie featuring a combination of cured, smoked, and cooked meats layered over a tomato sauce and melted cheese base.','products/Meat_Lovers_Pizza_non-veg.jpg',260.00,1,'2026-11-09 05:59:22.128345','2026-11-09 05:59:22.128367',2),(14,'Mediterranean Pizza','A Mediterranean pizza is a vibrant, veggie-forward or flatbread-based pie inspired by the fresh ingredients and bold flavors of the Mediterranean region.','products/Mediterranean_Pizza.jpg',240.00,1,'2026-11-09 06:00:11.136546','2026-11-09 06:00:11.136585',3),(15,'Mexican Veg Pizza','A Mexican Veg Pizza is a fusion-style pizza that combines traditional Italian pizza crust or tortilla bases with bold, spicy Mexican-inspired flavors and vibrant toppings.','products/Mexican_Veg_Pizza.jpg',300.00,1,'2026-11-09 06:01:01.993404','2026-11-09 06:01:01.993429',3),(16,'Mushroom Pizza','mushroom pizza is a savory vegetarian pie featuring an earthy, umami-rich topping of sliced or sautéed mushrooms laid over a crust, cheese, and a sauce base.','products/Mushroom_Pizza.jpg',280.00,1,'2026-11-09 06:01:58.903523','2026-11-09 06:01:58.903549',3),(17,'Paneer Tikka Pizza','paneer tikka pizza is a popular Indo-Western fusion dish that combines traditional Italian pizza crust and melted cheese with the smoky, spicy flavors of Indian paneer tikka.','products/Paneer_Tikka_Pizza.jpg',290.00,1,'2026-11-09 07:18:24.562602','2026-11-09 07:18:24.562631',3),(18,'Pepperoni Pizza','pepperoni pizza features a golden, chewy crust layered with tangy tomato or marinara sauce, melted mozzarella cheese, and thin rounds of spicy cured pepperoni sausage that crisp and curl at the edges during baking.','products/Pepperoni_Pizza_non-veg.jpg',270.00,1,'2026-11-09 07:19:21.042590','2026-11-09 07:19:21.042619',2),(19,'Sausage Pizza','chicken sausage pizza is a savory pie featuring sliced, seasoned chicken sausages layered over a rich tomato or creamy base, blanketed in melted mozzarella cheese.','products/Sausage_Pizza_non-veg.jpg',300.00,1,'2026-11-09 07:20:21.019273','2026-11-09 07:20:21.019296',2),(20,'Seafood Pizza','Seafood Pizza is a savory pie topped with fish and shellfish over a base of dough, sauce, and cheese.','products/Seafood_Pizza_non-veg.jpg',300.00,1,'2026-11-09 07:21:23.714242','2026-11-09 07:21:23.714271',2),(21,'Spinach Alfredo Pizza','A Spinach Alfredo Pizza is a rich, white-sauce specialty pie featuring a creamy Alfredo base, fresh or wilted spinach, and a generous layer of melted cheese on a pizza crust.','products/Spinach_Alfredo_Pizza.webp',300.00,1,'2026-11-09 07:22:59.366827','2026-11-09 07:22:59.366850',3),(22,'Veg Pizza Sample','Delicews pizzass','products/changepass_qdIm3wB.jpg',200.00,0,'2026-11-10 10:23:53.737789','2026-11-10 10:23:53.737817',3);
/*!40000 ALTER TABLE `user_pizzas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_returnrequest`
--

LOCK TABLES `user_returnrequest` WRITE;
/*!40000 ALTER TABLE `user_returnrequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_returnrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_user`
--

LOCK TABLES `user_user` WRITE;
/*!40000 ALTER TABLE `user_user` DISABLE KEYS */;
INSERT INTO `user_user` VALUES (3,'',NULL,0,'testUser','TestUser',0,1,'2026-10-29 11:48:45.883829','testuser@gamil.com','6282890090'),(5,'pbkdf2_sha256$1200000$F07aPIvXIUOftfBl0qqu5o$TPiXESCPgCk42eVYG72d4QSnF3KOTe8vYHDsfaq3O4s=',NULL,0,'Anoop V','',0,1,'2026-10-30 11:51:16.172020','anoopv@gmail.com','8606012603'),(7,'pbkdf2_sha256$1200000$6ECKwhiRqxlDtJbhTJ7yth$zus5C5ChXCG+tHn2IZXaj+lJn4ST7It4CbLUX6weVvk=',NULL,0,'vimal','Vimal Kumar',0,1,'2026-10-31 13:28:24.812322','vimal@gmail.com','8867452308'),(9,'pbkdf2_sha256$1200000$wBsb9ePTVF2os5TbCvt99N$EweXTLNBaC9q+DQRGnQXOy5pxItVBB5PC+khqMNuNCQ=',NULL,1,'admin','',1,1,'2026-11-02 09:02:54.526384','admin@gmail.com',''),(11,'pbkdf2_sha256$1200000$LnJdhqdCqnSiZtoX91OSXI$ATmpwrfZcUrG2tJsnF4qrMsTi8p9oNumgoZ0Cx6vIXQ=',NULL,0,'Arunima','Arunima Kumar',0,1,'2026-11-04 13:40:57.833920','arunima@gmail.com','9778559408'),(12,'pbkdf2_sha256$1200000$GOi54mHuCTf88B6PvgRRON$1adjLl8npQiWPDdZHiTrlxjZ1z9Fhk0kqQGHsrFvkGk=',NULL,0,'NewUser','',0,1,'2026-11-10 10:28:32.674962','newuser@gmail.com','8545127845');
/*!40000 ALTER TABLE `user_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_user_groups`
--

LOCK TABLES `user_user_groups` WRITE;
/*!40000 ALTER TABLE `user_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_user_user_permissions`
--

LOCK TABLES `user_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `user_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_userprofile`
--

LOCK TABLES `user_userprofile` WRITE;
/*!40000 ALTER TABLE `user_userprofile` DISABLE KEYS */;
INSERT INTO `user_userprofile` VALUES (1,'profile_picture/changepass.jpg','',7),(2,'','',5),(5,'','',11);
/*!40000 ALTER TABLE `user_userprofile` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-14 15:22:02
