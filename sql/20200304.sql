-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: localhost    Database: nine
-- ------------------------------------------------------
-- Server version	5.7.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `club`
--

DROP TABLE IF EXISTS `club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `clubId` int(6) DEFAULT NULL,
  `clubName` varchar(255) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `ownerName` varchar(255) DEFAULT NULL,
  `createTime` varchar(20) DEFAULT NULL,
  `opening` int(11) DEFAULT NULL,
  `ownerHeadUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club`
--

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;
INSERT INTO `club` VALUES (1,238909,'11',1,'1','1582215988',0,NULL),(2,497756,'12',1,'1','1582262616561',0,NULL),(3,529589,'1231',12,'112','1582860693997',0,NULL);
/*!40000 ALTER TABLE `club` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubapply`
--

DROP TABLE IF EXISTS `clubapply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubapply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(6) DEFAULT NULL,
  `clubId` int(6) DEFAULT NULL,
  `time` varchar(45) DEFAULT NULL,
  `nickName` varchar(100) DEFAULT NULL,
  `note` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubapply`
--

LOCK TABLES `clubapply` WRITE;
/*!40000 ALTER TABLE `clubapply` DISABLE KEYS */;
INSERT INTO `clubapply` VALUES (5,6,238909,'15822617240000','7','note');
/*!40000 ALTER TABLE `clubapply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubplaymethod`
--

DROP TABLE IF EXISTS `clubplaymethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubplaymethod` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gameName` varchar(45) DEFAULT NULL,
  `playMethod` varchar(255) DEFAULT NULL,
  `type` int(5) DEFAULT NULL,
  `gameId` int(6) DEFAULT NULL,
  `clubId` int(6) DEFAULT NULL,
  `index` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubplaymethod`
--

LOCK TABLES `clubplaymethod` WRITE;
/*!40000 ALTER TABLE `clubplaymethod` DISABLE KEYS */;
INSERT INTO `clubplaymethod` VALUES (1,'打锅子','{\"clubId\":238909,\"type\":2001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"onlyZimoHu\":true,\"bankerDouble\":true,\"payThree\":true}',0,2001,238909,0),(2,'打锅子','{\"clubId\":238909,\"type\":2001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"onlyZimoHu\":true,\"bankerDouble\":true,\"payThree\":true}',0,2001,238909,1),(3,'炸金花','{\"clubId\":238909,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true}',0,1001,238909,2);
/*!40000 ALTER TABLE `clubplaymethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubuser`
--

DROP TABLE IF EXISTS `clubuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(6) DEFAULT NULL,
  `nickName` varchar(255) DEFAULT NULL,
  `headUrl` varchar(255) DEFAULT NULL,
  `clubId` int(11) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `author` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubuser`
--

LOCK TABLES `clubuser` WRITE;
/*!40000 ALTER TABLE `clubuser` DISABLE KEYS */;
INSERT INTO `clubuser` VALUES (1,1,'1',NULL,238909,0,0),(2,2,'2',NULL,238909,2,1),(3,3,'3',NULL,238909,2,1),(4,4,'4',NULL,238909,2,2),(5,5,'5',NULL,238909,2,2),(6,1,'1',NULL,497756,0,0),(7,12,'112',NULL,529589,0,0);
/*!40000 ALTER TABLE `clubuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `id` int(1) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `gameId` int(4) DEFAULT NULL,
  `gameName` varchar(10) DEFAULT NULL,
  `enable` tinyint(1) DEFAULT NULL,
  `gameType` int(4) DEFAULT NULL COMMENT 'mahjong,poker,puyu',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (1,1001,'炸金花',1,8888),(2,1002,'斗地主',0,8888),(3,1003,'捉老麻',1,8888),(4,2001,'打锅子',1,9999),(5,2002,'陕西麻将',1,9999),(6,2002,'陕西麻将',1,9999);
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gamerule`
--

DROP TABLE IF EXISTS `gamerule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gamerule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gamename` varchar(20) DEFAULT NULL,
  `rule` varchar(500) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gamerule`
--

LOCK TABLES `gamerule` WRITE;
/*!40000 ALTER TABLE `gamerule` DISABLE KEYS */;
/*!40000 ALTER TABLE `gamerule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_accounts`
--

DROP TABLE IF EXISTS `t_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_accounts` (
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_accounts`
--

LOCK TABLES `t_accounts` WRITE;
/*!40000 ALTER TABLE `t_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_games`
--

DROP TABLE IF EXISTS `t_games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_games` (
  `room_uuid` char(20) NOT NULL,
  `game_index` smallint(6) NOT NULL,
  `base_info` varchar(1024) NOT NULL,
  `create_time` int(11) NOT NULL,
  `snapshots` char(255) DEFAULT NULL,
  `action_records` varchar(2048) DEFAULT NULL,
  `result` char(255) DEFAULT NULL,
  PRIMARY KEY (`room_uuid`,`game_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_games`
--

LOCK TABLES `t_games` WRITE;
/*!40000 ALTER TABLE `t_games` DISABLE KEYS */;
INSERT INTO `t_games` VALUES ('1583039357548300068',0,'{\"type\":2001,\"button\":0,\"index\":0,\"mahjongs\":[3,24,17,0,7,16,10,10,33,22,29,33,30,6,19,22,26,0,17,27,6,8,9,32,21,30,18,26,26,31,13,31,33,6,14,18,25,16,4,13,12,5,25,31,29,28,25,11,1,20,27,6,27,24,2,12,14,7,19,32,5,12,33,2,17,11,9,16,13,25,0,17,14,23,30,22,20,19,18,23,19,18,15,30,3,4,15,16,7,8,10,0,1,20,28,15,8,21,26,15,31,20,4,3,28,29,9,32,21,23,1,24,29,12,21,27,8,10,2,32,2,1,5,3,9,5,23,24,13,14,22,4,11,28,7,11],\"game_seats\":[[3,17,7,10,33,29,30,19,26,17,6,9,21,18],[24,0,16,10,22,33,6,22,0,27,8,32,30]]}',1583039485,NULL,'[0,1,18,1,2,26,1,1,27,0,2,26,0,1,29,1,2,31,1,1,26,0,3,26,0,1,33,1,2,13,1,1,30,0,2,31,0,1,30,1,2,33,1,1,31,0,2,6,0,1,31,1,2,14,1,1,32,0,2,18,0,1,21,1,2,25,1,1,10,0,2,16,0,1,3,1,2,4,1,1,8,0,2,13,0,1,9,1,2,12,1,1,16,0,2,5,0,1,6,1,2,25,1,1,24,0,2,31,0,1,31,1,2,29,1,1,29,0,2,28,0,1,28,1,2,25,1,1,4,0,2,11,0,1,10,1,2,1,1,1,6,0,2,20,0,1,16,1,2,27,1,1,27,0,2,6,0,1,6,1,2,27,1,1,27,0,2,24,0,1,24,1,2,2,1,1,0,0,2,12,0,6,12]','[8,-8]'),('1583039855348381368',0,'{\"type\":2001,\"button\":0,\"index\":0,\"mahjongs\":[12,16,1,17,4,5,20,22,27,14,24,8,30,28,24,32,19,29,14,30,2,9,1,33,1,16,25,17,16,6,15,20,28,21,22,28,21,27,18,0,0,33,3,2,13,13,17,7,25,16,19,12,10,6,15,0,23,4,17,1,2,29,5,7,3,14,23,10,26,15,32,31,10,30,22,14,8,4,31,12,30,21,18,26,6,18,5,3,11,23,13,2,32,9,20,6,29,31,19,27,7,25,29,9,24,33,5,18,26,32,33,11,0,27,4,7,3,11,12,19,25,24,9,13,11,10,28,26,20,31,15,23,21,8,22,8],\"game_seats\":[[12,1,4,20,27,24,30,24,19,14,2,1,1,25],[16,17,5,22,14,8,28,32,29,30,9,33,16]]}',1583039958,NULL,'[0,1,27,1,2,17,1,1,29,0,2,16,0,1,30,1,2,6,1,1,28,0,2,15,0,1,4,1,2,20,1,1,30,0,2,28,0,1,28,1,2,21,1,1,32,0,2,22,0,1,12,1,2,28,1,1,28,0,2,21,0,1,22,1,2,27,1,1,33,0,2,18,0,1,2,1,2,0,1,1,27,0,2,0,0,1,0,1,2,33,1,1,33,0,2,3,0,1,3,1,2,2,1,1,0,0,2,13,0,1,13,1,2,13,1,1,2,0,2,17,0,1,17,1,3,17,1,1,9,0,2,7,0,1,7,1,2,25,1,1,25,0,2,16,0,1,16,1,3,16,1,1,8,0,2,19,0,1,19,1,2,12,1,1,5,0,2,10,0,1,10,1,2,6,1,6,6]','[-7,7]'),('1583039855348381368',1,'{\"type\":2001,\"button\":1,\"index\":1,\"mahjongs\":[11,21,28,1,14,30,24,11,29,3,2,10,19,23,31,22,24,9,13,30,28,5,1,25,25,19,10,12,5,0,20,26,21,15,5,3,8,27,6,5,33,28,11,1,21,7,32,22,4,0,29,31,17,27,6,13,16,20,22,32,31,29,18,23,11,4,2,0,24,26,13,4,29,12,7,25,6,8,15,13,3,23,30,9,33,16,28,25,12,6,24,17,19,10,14,2,2,20,8,31,7,4,27,23,22,33,3,12,9,21,17,15,14,1,27,18,10,9,15,7,8,32,32,18,19,33,26,30,14,17,0,26,16,16,20,18],\"game_seats\":[[21,1,30,11,3,10,23,22,9,30,5,25,19],[11,28,14,24,29,2,19,31,24,13,28,1,25,10]]}',1583040083,NULL,'[1,1,29,0,2,12,0,1,1,1,2,5,1,1,5,0,2,0,0,1,0,1,2,20,1,1,14,0,2,26,0,1,26,1,2,21,1,1,31,0,2,15,0,1,15,1,2,5,1,1,5,0,2,3,0,1,9,1,2,8,1,1,8,0,2,27,0,1,27,1,2,6,1,1,6,0,2,5,0,1,19,1,2,33,1,1,33,0,2,28,0,1,28,1,3,28,1,1,25,0,2,11,0,1,25,1,2,1,1,1,1,0,2,21,0,1,21,1,2,7,1,1,7,0,2,32,0,1,11,1,2,22,1,1,22,0,2,4,0,1,32,1,2,0,1,1,10,0,2,29,0,1,29,1,2,31,1,1,31,0,2,17,0,1,17,1,2,27,1,1,27,0,2,6,0,1,6,1,2,13,1,1,13,0,2,16,0,1,16,1,2,20,1,1,20,0,2,22,0,1,22,1,2,32,1,1,32,0,2,31,0,1,31,1,2,29,1,1,29,0,2,18,0,1,18,1,2,23,1,1,23,0,2,11,0,1,11,1,2,4,1,1,4,0,5,4]','[5,-5]');
/*!40000 ALTER TABLE `t_games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_games_archive`
--

DROP TABLE IF EXISTS `t_games_archive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_games_archive` (
  `room_uuid` char(20) NOT NULL,
  `game_index` smallint(6) NOT NULL,
  `base_info` varchar(1024) NOT NULL,
  `create_time` int(11) NOT NULL,
  `snapshots` char(255) DEFAULT NULL,
  `action_records` varchar(2048) DEFAULT NULL,
  `result` char(255) DEFAULT NULL,
  PRIMARY KEY (`room_uuid`,`game_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_games_archive`
--

LOCK TABLES `t_games_archive` WRITE;
/*!40000 ALTER TABLE `t_games_archive` DISABLE KEYS */;
INSERT INTO `t_games_archive` VALUES ('1582815132017459994',0,'{\"type\":2001,\"button\":0,\"index\":0,\"mahjongs\":[1,10,32,22,21,26,10,11,7,6,32,20,15,6,25,27,30,17,14,5,29,17,22,29,6,1,20,18,3,13,33,21,32,0,27,4,19,23,4,10,22,9,12,9,33,12,23,7,29,28,3,31,23,8,18,15,26,3,2,19,15,16,8,21,24,11,30,24,9,0,30,16,24,29,5,7,16,0,33,11,6,17,28,20,23,12,22,21,19,18,7,12,31,13,11,27,27,9,10,24,15,14,0,14,1,8,25,13,8,26,33,2,32,28,16,3,26,14,5,4,1,2,5,2,28,31,19,18,13,25,17,4,25,20,30,31],\"game_seats\":[[1,32,21,10,7,32,15,25,30,14,29,22,6,20],[10,22,26,11,6,20,6,27,17,5,17,29,1]]}',1582815261,NULL,'[0,1,30,1,2,18,1,1,29,0,2,3,0,1,29,1,2,13,1,1,27,0,2,33,0,1,33,1,2,21,1,1,1,0,2,32,0,1,25,1,2,0,1,1,18,0,2,27,0,1,10,1,2,4,1,1,0,0,2,19,0,1,1,1,2,23,1,1,20,0,2,4,0,1,27,1,2,10,1,1,10,0,2,22,0,1,7,1,2,9,1,1,13,0,2,12,0,1,12,1,2,9,1,1,9,0,2,33,0,1,33,1,2,12,1,1,12,0,2,23,0,1,6,1,3,6,1,1,26,0,2,7,0,1,7,1,2,29,1,1,29,0,2,28,0,1,28,1,2,3,1,6,3]','[-4,4]'),('1583040451575152627',0,'{\"type\":2001,\"button\":0,\"index\":0,\"mahjongs\":[24,29,33,21,11,30,17,24,30,1,0,8,11,7,5,18,7,10,31,12,28,1,9,22,26,3,31,26,27,27,4,19,25,19,0,21,32,32,25,25,18,0,18,1,31,3,16,24,30,4,10,17,22,9,11,25,6,31,7,23,29,9,22,10,22,12,28,1,28,0,19,29,26,20,29,18,27,8,23,27,6,26,30,2,15,28,16,3,6,13,21,4,6,13,23,5,14,33,15,2,32,13,8,12,15,24,12,16,3,13,32,11,5,9,10,14,33,20,16,7,2,14,21,20,23,5,20,33,19,17,2,4,17,8,14,15],\"game_seats\":[[24,33,11,17,30,0,11,5,7,31,28,9,26,31],[29,21,30,24,1,8,7,18,10,12,1,22,3]]}',1583040644,NULL,'[0,1,28,1,2,26,1,1,29,0,2,27,0,1,30,1,2,27,1,1,30,0,2,4,0,1,33,1,2,19,1,1,27,0,2,25,0,1,27,1,2,19,1,1,3,0,2,0,0,1,7,1,2,21,1,1,10,0,2,32,0,1,32,1,2,32,1,1,12,0,2,25,0,1,17,1,2,25,1,1,32,0,2,18,0,1,18,1,2,0,1,1,0,0,3,0,0,1,25,1,2,18,1,1,8,0,2,1,0,1,1,1,3,1,1,1,7,0,2,31,0,1,9,1,2,3,1,1,3,0,2,16,0,1,16,1,2,24,1,1,22,0,2,30,0,1,30,1,2,4,1,1,4,0,2,10,0,1,10,1,2,17,1,1,17,0,2,22,0,1,22,1,2,9,1,1,9,0,2,11,0,1,4,1,2,25,1,1,26,0,2,6,0,1,5,1,2,31,1,1,31,0,4,31,0,2,7,0,1,6,1,2,23,1,1,23,0,2,29,0,1,24,1,3,24,1,1,18,0,2,9,0,1,25,1,3,25,1,1,18,0,2,22,0,1,29,1,2,10,1,1,10,0,2,22,0,1,26,1,2,12,1,1,12,0,2,28,0,1,9,1,2,1,1,4,1,1,2,28,1,1,21,0,2,0,0,4,0,0,2,19,0,1,28,1,2,29,1,1,21,0,2,26,0,1,19,1,3,19,1,1,28,0,2,20,0,1,20,1,2,29,1,6,29]','[-1,1]'),('1583040451575152627',1,'{\"type\":2001,\"button\":1,\"index\":1,\"mahjongs\":[26,7,33,5,1,6,21,20,17,7,1,18,14,26,32,13,32,22,8,17,22,15,7,0,16,30,25,13,30,21,9,3,2,11,18,15,8,31,24,1,13,19,29,24,29,25,12,26,21,11,27,15,21,9,19,18,3,31,22,16,14,20,26,28,2,19,27,29,23,18,2,31,31,10,2,33,5,23,14,6,23,27,19,10,12,11,30,33,8,33,4,12,25,24,13,16,5,20,32,0,16,12,4,32,28,1,0,10,28,5,29,22,28,4,3,20,3,9,6,15,14,9,23,30,8,7,17,25,11,0,6,17,24,4,27,10],\"game_seats\":[[7,5,6,20,7,18,26,13,22,17,15,0,30],[26,33,1,21,17,1,14,32,32,8,22,7,16,25]]}',1583040966,NULL,'[1,1,33,0,2,13,0,1,30,1,2,30,1,1,30,0,2,21,0,1,18,1,2,9,1,1,9,0,2,3,0,1,0,1,2,2,1,1,17,0,2,11,0,1,11,1,2,18,1,1,18,0,2,15,0,1,17,1,2,8,1,1,26,0,2,31,0,1,31,1,2,24,1,1,25,0,2,1,0,1,1,1,3,1,1,1,2,0,2,13,0,1,26,1,2,19,1,1,19,0,2,29,0,1,29,1,2,24,1,1,7,0,3,7,0,1,3,1,2,29,1,1,29,0,2,25,0,1,25,1,2,12,1,1,12,0,2,26,0,1,26,1,2,21,1,1,21,0,2,11,0,1,11,1,2,27,1,1,27,0,2,15,0,1,5,1,2,21,1,1,21,0,2,9,0,1,9,1,2,19,1,1,19,0,2,18,0,1,18,1,2,3,1,1,3,0,2,31,0,1,31,1,2,22,1,1,22,0,2,16,0,1,16,1,2,14,1,1,16,0,2,20,0,1,20,1,2,26,1,1,26,0,2,28,0,1,6,1,2,2,1,1,2,0,2,19,0,1,19,1,2,27,1,1,27,0,2,29,0,1,29,1,2,23,1,1,23,0,2,18,0,1,18,1,2,2,1,1,2,0,2,31,0,1,31,1,2,31,1,1,31,0,2,10,0,1,10,1,2,2,1,1,2,0,2,33,0,1,33,1,2,5,1,1,5,0,2,23,0,1,23,1,2,14,1,1,14,0,2,6,0,1,6,1,2,23,1,1,23,0,2,27,0,1,27,1,2,19,1,1,19,0,2,10,0,1,10,1,2,12,1,1,12,0,2,11,0,1,11,1,2,30,1,1,30,0,2,33,0,1,33,1,2,8,1,1,8,0,2,33,0,1,33,1,2,4,1,1,4,0,2,12,0,1,12,1,2,25,1,1,25,0,2,24,0,1,24,1,3,24,1,1,21,0,2,13,0,4,13,0,2,16,0,1,16,1,2,5,1,1,22,0,2,20,0,1,20,1,2,32,1,1,5,0,2,0,0,1,0,1,2,16,1,1,16,0,2,12,0,1,12,1,2,4,1,1,4,0,2,32,0,1,32,1,4,32,1,2,28,1,1,28,0,5,28]','[10,-10]'),('1583040451575152627',2,'{\"type\":2001,\"button\":0,\"index\":2,\"mahjongs\":[20,18,18,30,4,33,25,32,12,0,16,3,6,20,16,2,22,25,7,12,24,31,23,6,8,13,32,2,21,4,14,20,31,4,24,3,17,20,17,7,16,33,29,28,33,15,30,10,5,10,21,11,19,30,22,8,30,1,4,3,25,8,21,0,24,0,28,28,2,27,7,11,9,23,28,22,19,17,27,13,23,14,12,13,12,32,11,32,19,16,23,29,5,1,5,9,14,9,5,1,26,26,26,18,15,10,7,18,15,11,22,6,29,33,3,27,26,25,19,1,10,31,14,13,29,0,2,8,6,17,31,27,21,24,9,15],\"game_seats\":[[20,18,4,25,12,16,6,16,22,7,24,23,8,32],[18,30,33,32,0,3,20,2,25,12,31,6,13]]}',1583041055,NULL,'[0,1,32,1,2,2,1,1,30,0,2,21,0,1,18,1,2,4,1,1,33,0,2,14,0,1,4,1,2,20,1,1,18,0,2,31,0,1,31,1,2,4,1,1,31,0,2,24,0,1,12,1,2,3,1,1,32,0,2,17,0,1,14,1,2,20,1,1,25,0,2,17,0,1,24,1,2,7,1,1,0,0,2,16,0,6,16]','[16,-16]'),('1583040451575152627',3,'{\"type\":2001,\"button\":0,\"index\":3,\"mahjongs\":[5,27,26,15,9,3,24,21,4,33,1,24,4,14,32,4,15,27,5,26,23,20,24,10,6,0,12,32,24,19,10,1,20,8,13,1,2,22,28,9,27,7,19,6,19,2,20,19,15,29,11,23,16,29,1,9,0,11,17,25,16,5,27,21,0,26,28,30,10,7,22,17,23,17,25,2,0,14,25,33,22,29,33,14,7,7,18,8,20,32,30,11,5,21,18,22,11,8,14,28,3,18,23,6,18,16,13,9,32,12,28,16,6,4,12,21,26,13,10,17,29,33,8,30,25,2,3,15,31,31,13,31,31,30,3,12],\"game_seats\":[[5,26,9,24,4,1,4,32,15,5,23,24,6,12],[27,15,3,21,33,24,14,4,27,26,20,10,0]]}',1583041174,NULL,'[0,1,32,1,2,32,1,1,33,0,2,24,0,1,9,1,2,19,1,1,32,0,2,10,0,1,1,1,2,1,1,1,0,0,2,20,0,1,10,1,2,8,1,1,8,0,2,13,0,1,15,1,2,1,1,1,26,0,2,2,0,1,2,1,2,22,1,1,10,0,2,28,0,1,28,1,2,9,1,1,9,0,2,27,0,1,27,1,3,27,1,1,24,0,3,24,0,1,20,1,2,7,1,1,7,0,2,19,0,4,24,0,2,6,0,1,19,1,2,19,1,1,3,0,2,2,0,1,2,1,2,20,1,1,4,0,3,4,0,1,26,1,2,19,1,1,20,0,2,15,0,1,15,1,2,29,1,1,29,0,2,11,0,1,11,1,2,23,1,1,20,0,2,16,0,1,16,1,5,16]','[-1,1]');
/*!40000 ALTER TABLE `t_games_archive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_guests`
--

DROP TABLE IF EXISTS `t_guests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_guests` (
  `guest_account` varchar(255) NOT NULL,
  PRIMARY KEY (`guest_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_guests`
--

LOCK TABLES `t_guests` WRITE;
/*!40000 ALTER TABLE `t_guests` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_guests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_message`
--

DROP TABLE IF EXISTS `t_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_message` (
  `type` varchar(32) NOT NULL,
  `msg` varchar(1024) NOT NULL,
  `version` varchar(32) NOT NULL,
  PRIMARY KEY (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_message`
--

LOCK TABLES `t_message` WRITE;
/*!40000 ALTER TABLE `t_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_rooms`
--

DROP TABLE IF EXISTS `t_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_rooms` (
  `uuid` char(20) NOT NULL,
  `id` char(8) NOT NULL,
  `base_info` varchar(256) NOT NULL DEFAULT '0',
  `create_time` int(11) NOT NULL,
  `num_of_turns` int(11) NOT NULL DEFAULT '0',
  `next_button` int(11) NOT NULL DEFAULT '0',
  `user_id0` int(11) NOT NULL DEFAULT '0',
  `user_icon0` varchar(128) NOT NULL DEFAULT 'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg',
  `user_name0` varchar(32) NOT NULL DEFAULT '',
  `user_score0` int(11) NOT NULL DEFAULT '0',
  `user_id1` int(11) NOT NULL DEFAULT '0',
  `user_icon1` varchar(128) NOT NULL DEFAULT 'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg',
  `user_name1` varchar(32) NOT NULL DEFAULT '',
  `user_score1` int(11) NOT NULL DEFAULT '0',
  `user_id2` int(11) NOT NULL DEFAULT '0',
  `user_icon2` varchar(128) NOT NULL DEFAULT 'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg',
  `user_name2` varchar(32) NOT NULL DEFAULT '',
  `user_score2` int(11) NOT NULL DEFAULT '0',
  `user_id3` int(11) NOT NULL DEFAULT '0',
  `user_icon3` varchar(128) NOT NULL DEFAULT 'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg',
  `user_name3` varchar(32) NOT NULL DEFAULT '',
  `user_score3` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(16) DEFAULT NULL,
  `port` int(11) DEFAULT '0',
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_rooms`
--

LOCK TABLES `t_rooms` WRITE;
/*!40000 ALTER TABLE `t_rooms` DISABLE KEYS */;
INSERT INTO `t_rooms` VALUES ('1583138295020775927','775927','{\"clubId\":0,\"type\":2001,\"roomType\":1002,\"maxPlayRound\":4,\"playerCount\":2,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"onlyZimoHu\":true,\"bankerDouble\":true,\"payThree\":true,\"creator\":1,\"curPlayRound\":0,\"baseScore\":1}',1583138296,0,0,1,'','MQ==',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583140991278122660','122660','{\"clubId\":0,\"type\":2001,\"roomType\":1002,\"maxPlayRound\":4,\"playerCount\":2,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"onlyZimoHu\":true,\"bankerDouble\":true,\"payThree\":true,\"creator\":4,\"curPlayRound\":0,\"baseScore\":1}',1583140992,0,0,4,'','MTk=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583147154323108593','108593','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":6,\"curPlayRound\":0,\"baseScore\":1}',1583147155,0,0,6,'','NDEy',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583147206885838497','838497','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":7,\"curPlayRound\":0,\"baseScore\":1}',1583147207,0,0,7,'','MTMy',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583147295173564692','564692','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":8,\"curPlayRound\":0,\"baseScore\":1}',1583147296,0,0,8,'','Mw==',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583147360193297254','297254','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":9,\"curPlayRound\":0,\"baseScore\":1}',1583147361,0,0,9,'','NQ==',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583148026617025881','025881','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":10,\"curPlayRound\":0,\"baseScore\":1}',1583148027,0,0,10,'','Ng==',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583148238479413897','413897','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":11,\"curPlayRound\":0,\"baseScore\":1}',1583148239,0,0,11,'','Nw==',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583148403851162805','162805','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":12,\"curPlayRound\":0,\"baseScore\":1}',1583148404,0,0,12,'','OQ==',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583148506149043749','043749','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":13,\"curPlayRound\":0,\"baseScore\":1}',1583148507,0,0,13,'','MTE=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583148560128810444','810444','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":14,\"curPlayRound\":0,\"baseScore\":1}',1583148561,0,0,14,'','MTQ=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583148723186014713','014713','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":3,\"curPlayRound\":0,\"baseScore\":1}',1583148724,0,0,3,'','MTU=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583164631044521027','521027','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":15,\"curPlayRound\":0,\"baseScore\":1}',1583164632,0,0,15,'','MTUyMQ==',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583164722247506830','506830','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":16,\"curPlayRound\":0,\"baseScore\":1}',1583164723,0,0,16,'','NTIx',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583164760316271714','271714','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":17,\"curPlayRound\":0,\"baseScore\":1}',1583164761,0,0,17,'','MzE1',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583164863415914034','914034','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":18,\"curPlayRound\":0,\"baseScore\":1}',1583164864,0,0,18,'','NTEyMQ==',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583164902179149310','149310','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":19,\"curPlayRound\":0,\"baseScore\":1}',1583164903,0,0,19,'','MTUx',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583164953615736980','736980','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":20,\"curPlayRound\":0,\"baseScore\":1}',1583164954,0,0,20,'','MTMxMg==',0,21,'','NzE=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583203925368964489','964489','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":22,\"curPlayRound\":0,\"baseScore\":1}',1583203926,0,0,22,'','NTE=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583204315273363115','363115','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":23,\"curPlayRound\":0,\"baseScore\":1}',1583204316,0,0,23,'','NjE=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583204562857326339','326339','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":24,\"curPlayRound\":0,\"baseScore\":1}',1583204563,0,0,24,'','ODE=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583204768211885771','885771','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":25,\"curPlayRound\":0,\"baseScore\":1}',1583204769,0,0,25,'','NTI=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583204817081289522','289522','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":26,\"curPlayRound\":0,\"baseScore\":1}',1583204818,0,0,26,'','NTM=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000),('1583204871976143444','143444','{\"clubId\":0,\"type\":1001,\"roomType\":1002,\"maxPlayRound\":0,\"playerCount\":2,\"payMethod\":0,\"continuous\":false,\"checkCheat\":false,\"readyMethod\":1001,\"tingTip\":true,\"creator\":27,\"curPlayRound\":0,\"baseScore\":1}',1583204872,0,0,27,'','NTQ=',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,0,'https://v1.qzone.cc/avatar/201408/09/17/37/53e5ebd226033310.png!200x200.jpg','',0,'192.168.0.199',10000);
/*!40000 ALTER TABLE `t_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_users`
--

DROP TABLE IF EXISTS `t_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_users` (
  `userId` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `account` varchar(64) NOT NULL DEFAULT '' COMMENT '账号',
  `name` varchar(32) DEFAULT NULL COMMENT '用户昵称',
  `sex` int(1) DEFAULT NULL,
  `headimg` varchar(256) DEFAULT NULL,
  `lv` smallint(6) DEFAULT '1' COMMENT '用户等级',
  `exp` int(11) DEFAULT '0' COMMENT '用户经验',
  `coins` int(11) DEFAULT '0' COMMENT '用户金币',
  `gems` int(11) DEFAULT '0' COMMENT '用户宝石',
  `roomid` varchar(8) DEFAULT NULL,
  `history` varchar(4096) DEFAULT '',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_users`
--

LOCK TABLES `t_users` WRITE;
/*!40000 ALTER TABLE `t_users` DISABLE KEYS */;
INSERT INTO `t_users` VALUES (1,'1','1',0,NULL,1,0,1000,21,'775927',''),(2,'2','2',0,NULL,1,0,1000,21,NULL,''),(3,'15','15',0,NULL,1,0,1000,21,'014713',''),(4,'19','19',0,NULL,1,0,1000,21,'122660',''),(5,'142','142',0,NULL,1,0,1000,21,NULL,''),(6,'412','412',0,NULL,1,0,1000,21,'108593',''),(7,'132','132',0,NULL,1,0,1000,21,'838497',''),(8,'3','3',0,NULL,1,0,1000,21,'564692',''),(9,'5','5',0,NULL,1,0,1000,21,'297254',''),(10,'6','6',0,NULL,1,0,1000,21,'025881',''),(11,'7','7',0,NULL,1,0,1000,21,'413897',''),(12,'9','9',0,NULL,1,0,1000,21,'162805',''),(13,'11','11',0,NULL,1,0,1000,21,'043749',''),(14,'14','14',0,NULL,1,0,1000,21,'810444',''),(15,'1521','1521',0,NULL,1,0,1000,21,'521027',''),(16,'521','521',0,NULL,1,0,1000,21,'506830',''),(17,'315','315',0,NULL,1,0,1000,21,'271714',''),(18,'5121','5121',0,NULL,1,0,1000,21,'914034',''),(19,'151','151',0,NULL,1,0,1000,21,'149310',''),(20,'1312','1312',0,NULL,1,0,1000,21,'736980',''),(21,'71','71',0,NULL,1,0,1000,21,'736980',''),(22,'51','51',0,NULL,1,0,1000,21,'964489',''),(23,'61','61',0,NULL,1,0,1000,21,'363115',''),(24,'81','81',0,NULL,1,0,1000,21,'326339',''),(25,'52','52',0,NULL,1,0,1000,21,'885771',''),(26,'53','53',0,NULL,1,0,1000,21,'289522',''),(27,'54','54',0,NULL,1,0,1000,21,'143444','');
/*!40000 ALTER TABLE `t_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-04 21:26:55
