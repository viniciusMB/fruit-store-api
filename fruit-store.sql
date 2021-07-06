-- MariaDB dump 10.19  Distrib 10.5.11-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: barraca
-- ------------------------------------------------------
-- Server version	10.5.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `costumers`
--

DROP TABLE IF EXISTS `costumers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `costumers` (
  `name` varchar(30) NOT NULL,
  `cpf` char(11) NOT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `costumer_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`costumer_id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costumers`
--

LOCK TABLES `costumers` WRITE;
/*!40000 ALTER TABLE `costumers` DISABLE KEYS */;
INSERT INTO `costumers` VALUES ('joãozinho','04698536323','71996784469',8,'joazinho123@gmail.com','$2b$10$oS7bztlFW02/pFRkpD8ZF.AbauzrgOGeI.fgf6ohrjyY7evV7X8nK');
/*!40000 ALTER TABLE `costumers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fruits`
--

DROP TABLE IF EXISTS `fruits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fruits` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `fruit_name` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fruits`
--

LOCK TABLES `fruits` WRITE;
/*!40000 ALTER TABLE `fruits` DISABLE KEYS */;
INSERT INTO `fruits` VALUES (1,'banana',2),(2,'abacaxi',4),(3,'laranja',2),(7,'melancia',8),(9,'Abacate',3);
/*!40000 ALTER TABLE `fruits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_details` (
  `product` int(11) NOT NULL,
  `orderd_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `detailsId` int(11) NOT NULL AUTO_INCREMENT,
  UNIQUE KEY `detailsId` (`detailsId`),
  KEY `order_fk` (`orderd_id`),
  KEY `product_fk` (`product`),
  CONSTRAINT `order_fk` FOREIGN KEY (`orderd_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `product_fk` FOREIGN KEY (`product`) REFERENCES `fruits` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `costumer` int(11) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `costumer_fk` (`costumer`),
  CONSTRAINT `costumer_fk` FOREIGN KEY (`costumer`) REFERENCES `costumers` (`costumer_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-03 19:30:11
